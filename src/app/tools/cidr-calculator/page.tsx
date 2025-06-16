"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CIDRInfo {
  network: string;
  prefix: number;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  totalAddresses: number;
  usableAddresses: number;
  firstUsableIP: string;
  lastUsableIP: string;
  networkClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'Private' | 'Loopback' | 'APIPA' | 'Multicast';
  isPrivate: boolean;
  binaryNetwork: string;
  binaryMask: string;
}

interface SubnetPlan {
  name: string;
  requiredHosts: number;
  suggestedPrefix: number;
  actualHosts: number;
  network?: string;
}

export default function CIDRCalculatorPage() {
  const [cidrInput, setCidrInput] = useState('192.168.1.0/24');
  const [subnetPlans, setSubnetPlans] = useState<SubnetPlan[]>([]);
  const [newSubnetName, setNewSubnetName] = useState('');
  const [newSubnetHosts, setNewSubnetHosts] = useState<number>(30);
  const [showIPList, setShowIPList] = useState(false);
  const [maxIPsToShow, setMaxIPsToShow] = useState(256);

  const parseCIDR = useCallback((cidr: string): CIDRInfo | null => {
    const match = cidr.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
    if (!match) return null;

    const [, a, b, c, d, prefixStr] = match;
    const prefix = parseInt(prefixStr);
    
    if (prefix < 0 || prefix > 32) return null;
    if ([a, b, c, d].some(octet => parseInt(octet) > 255)) return null;

    const ipNumber = (parseInt(a) << 24) + (parseInt(b) << 16) + (parseInt(c) << 8) + parseInt(d);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const networkNumber = (ipNumber & mask) >>> 0;
    const broadcastNumber = (networkNumber | (0xFFFFFFFF >>> prefix)) >>> 0;

    const toIP = (num: number): string => {
      return [
        (num >>> 24) & 0xFF,
        (num >>> 16) & 0xFF,
        (num >>> 8) & 0xFF,
        num & 0xFF
      ].join('.');
    };

    const networkAddress = toIP(networkNumber);
    const broadcastAddress = toIP(broadcastNumber);
    const subnetMask = toIP(mask);
    const wildcardMask = toIP((~mask) >>> 0);

    const totalAddresses = Math.pow(2, 32 - prefix);
    const usableAddresses = totalAddresses > 2 ? totalAddresses - 2 : totalAddresses;

    const firstUsableIP = totalAddresses > 2 ? toIP(networkNumber + 1) : networkAddress;
    const lastUsableIP = totalAddresses > 2 ? toIP(broadcastNumber - 1) : broadcastAddress;

    // ネットワーククラス判定
    const firstOctet = parseInt(a);
    let networkClass: CIDRInfo['networkClass'];
    let isPrivate = false;

    if (firstOctet >= 224 && firstOctet <= 239) {
      networkClass = 'Multicast';
    } else if (firstOctet >= 240) {
      networkClass = 'E';
    } else if (firstOctet === 127) {
      networkClass = 'Loopback';
    } else if (firstOctet === 169 && parseInt(b) === 254) {
      networkClass = 'APIPA';
    } else if (
      (firstOctet === 10) ||
      (firstOctet === 172 && parseInt(b) >= 16 && parseInt(b) <= 31) ||
      (firstOctet === 192 && parseInt(b) === 168)
    ) {
      networkClass = 'Private';
      isPrivate = true;
    } else if (firstOctet >= 1 && firstOctet <= 126) {
      networkClass = 'A';
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      networkClass = 'B';
    } else {
      networkClass = 'C';
    }

    // バイナリ表現
    const toBinary = (num: number): string => {
      return num.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || '';
    };

    return {
      network: cidr,
      prefix,
      networkAddress,
      broadcastAddress,
      subnetMask,
      wildcardMask,
      totalAddresses,
      usableAddresses,
      firstUsableIP,
      lastUsableIP,
      networkClass,
      isPrivate,
      binaryNetwork: toBinary(networkNumber),
      binaryMask: toBinary(mask)
    };
  }, []);

  const cidrInfo = useMemo(() => {
    return parseCIDR(cidrInput);
  }, [cidrInput, parseCIDR]);

  const generateIPList = useCallback((info: CIDRInfo): string[] => {
    if (!info || info.totalAddresses > maxIPsToShow) return [];

    const ips: string[] = [];
    const [a, b, c, d] = info.networkAddress.split('.').map(Number);
    const baseNumber = (a << 24) + (b << 16) + (c << 8) + d;

    for (let i = 0; i < Math.min(info.totalAddresses, maxIPsToShow); i++) {
      const ipNumber = baseNumber + i;
      const ip = [
        (ipNumber >>> 24) & 0xFF,
        (ipNumber >>> 16) & 0xFF,
        (ipNumber >>> 8) & 0xFF,
        ipNumber & 0xFF
      ].join('.');
      ips.push(ip);
    }

    return ips;
  }, [maxIPsToShow]);

  const calculateOptimalPrefix = (requiredHosts: number): number => {
    // 必要なホスト数に2を加える（ネットワークアドレスとブロードキャストアドレス）
    const totalNeeded = requiredHosts + 2;
    // 2の何乗が必要かを計算
    const bitsNeeded = Math.ceil(Math.log2(totalNeeded));
    // プレフィックス長を計算
    return 32 - bitsNeeded;
  };

  const addSubnetPlan = () => {
    if (!newSubnetName || newSubnetHosts <= 0) return;

    const suggestedPrefix = calculateOptimalPrefix(newSubnetHosts);
    const actualHosts = Math.pow(2, 32 - suggestedPrefix) - 2;

    const plan: SubnetPlan = {
      name: newSubnetName,
      requiredHosts: newSubnetHosts,
      suggestedPrefix,
      actualHosts
    };

    setSubnetPlans([...subnetPlans, plan]);
    setNewSubnetName('');
    setNewSubnetHosts(30);
  };

  const removeSubnetPlan = (index: number) => {
    setSubnetPlans(subnetPlans.filter((_, i) => i !== index));
  };

  const generateSubnets = () => {
    if (!cidrInfo || subnetPlans.length === 0) return;

    // プランをホスト数の降順でソート
    const sortedPlans = [...subnetPlans].sort((a, b) => b.requiredHosts - a.requiredHosts);
    
    const [a, b, c, d] = cidrInfo.networkAddress.split('.').map(Number);
    let currentNetwork = (a << 24) + (b << 16) + (c << 8) + d;

    const updatedPlans = sortedPlans.map(plan => {
      const subnetSize = Math.pow(2, 32 - plan.suggestedPrefix);
      const network = [
        (currentNetwork >>> 24) & 0xFF,
        (currentNetwork >>> 16) & 0xFF,
        (currentNetwork >>> 8) & 0xFF,
        currentNetwork & 0xFF
      ].join('.');

      const subnet = `${network}/${plan.suggestedPrefix}`;
      currentNetwork += subnetSize;

      return { ...plan, network: subnet };
    });

    setSubnetPlans(updatedPlans);
  };

  const getClassDescription = (networkClass: CIDRInfo['networkClass']): string => {
    switch (networkClass) {
      case 'A': return 'クラスA (1.0.0.0 - 126.255.255.255)';
      case 'B': return 'クラスB (128.0.0.0 - 191.255.255.255)';
      case 'C': return 'クラスC (192.0.0.0 - 223.255.255.255)';
      case 'D': return 'クラスD (224.0.0.0 - 239.255.255.255) - マルチキャスト';
      case 'E': return 'クラスE (240.0.0.0 - 255.255.255.255) - 実験用';
      case 'Private': return 'プライベートアドレス';
      case 'Loopback': return 'ループバックアドレス (127.0.0.0/8)';
      case 'APIPA': return 'APIPA (169.254.0.0/16) - 自動プライベートIP';
      case 'Multicast': return 'マルチキャストアドレス';
      default: return '';
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <ToolLayout
      title="CIDR計算機"
      description="CIDR記法のIPアドレス範囲計算・サブネット分析ツール"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>CIDR入力</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cidr">CIDR記法</Label>
                <Input
                  id="cidr"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  placeholder="192.168.1.0/24"
                  className="font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  '192.168.1.0/24',
                  '10.0.0.0/8',
                  '172.16.0.0/12',
                  '192.168.0.0/16'
                ].map(example => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setCidrInput(example)}
                    className="font-mono text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {!cidrInfo && cidrInput && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-700">
                無効なCIDR記法です。正しい形式で入力してください（例: 192.168.1.0/24）
              </p>
            </CardContent>
          </Card>
        )}

        {cidrInfo && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>ネットワーク情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">ネットワーク:</span>
                      <span className="font-mono">{cidrInfo.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ネットワークアドレス:</span>
                      <span className="font-mono">{cidrInfo.networkAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ブロードキャストアドレス:</span>
                      <span className="font-mono">{cidrInfo.broadcastAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">サブネットマスク:</span>
                      <span className="font-mono">{cidrInfo.subnetMask}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ワイルドカードマスク:</span>
                      <span className="font-mono">{cidrInfo.wildcardMask}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">総アドレス数:</span>
                      <span className="font-mono">{formatNumber(cidrInfo.totalAddresses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">利用可能アドレス数:</span>
                      <span className="font-mono">{formatNumber(cidrInfo.usableAddresses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">最初の利用可能IP:</span>
                      <span className="font-mono">{cidrInfo.firstUsableIP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">最後の利用可能IP:</span>
                      <span className="font-mono">{cidrInfo.lastUsableIP}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">ネットワーククラス:</span>
                      <div className="text-right">
                        <Badge variant={cidrInfo.isPrivate ? "default" : "outline"}>
                          {cidrInfo.networkClass}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">
                          {getClassDescription(cidrInfo.networkClass)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="binary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="binary">バイナリ表示</TabsTrigger>
                <TabsTrigger value="subnetting">サブネット設計</TabsTrigger>
                <TabsTrigger value="iplist">IPアドレス一覧</TabsTrigger>
              </TabsList>

              <TabsContent value="binary" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>バイナリ表現</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 font-mono text-sm">
                      <div>
                        <Label>ネットワークアドレス (バイナリ):</Label>
                        <div className="bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                          {cidrInfo.binaryNetwork}
                        </div>
                      </div>
                      <div>
                        <Label>サブネットマスク (バイナリ):</Label>
                        <div className="bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                          {cidrInfo.binaryMask}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>ネットワーク部: 最初の{cidrInfo.prefix}ビット</p>
                        <p>ホスト部: 最後の{32 - cidrInfo.prefix}ビット</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subnetting" className="mt-4">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>サブネット要件追加</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="subnetName">サブネット名</Label>
                          <Input
                            id="subnetName"
                            value={newSubnetName}
                            onChange={(e) => setNewSubnetName(e.target.value)}
                            placeholder="Sales, Marketing など"
                          />
                        </div>
                        <div>
                          <Label htmlFor="requiredHosts">必要ホスト数</Label>
                          <Input
                            id="requiredHosts"
                            type="number"
                            value={newSubnetHosts}
                            onChange={(e) => setNewSubnetHosts(parseInt(e.target.value) || 0)}
                            placeholder="30"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={addSubnetPlan} className="w-full">
                            追加
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {subnetPlans.length > 0 && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>サブネット設計</CardTitle>
                          <Button onClick={generateSubnets} variant="outline">
                            サブネット生成
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {subnetPlans.map((plan, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{plan.name}</h4>
                                <Button
                                  onClick={() => removeSubnetPlan(index)}
                                  variant="outline"
                                  size="sm"
                                >
                                  削除
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">必要ホスト:</span>
                                  <div className="font-mono">{plan.requiredHosts}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">推奨プレフィックス:</span>
                                  <div className="font-mono">/{plan.suggestedPrefix}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">実際のホスト数:</span>
                                  <div className="font-mono">{plan.actualHosts}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">ネットワーク:</span>
                                  <div className="font-mono">{plan.network || '未生成'}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="iplist" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>IPアドレス一覧</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showIPs"
                            checked={showIPList}
                            onCheckedChange={(checked) => setShowIPList(!!checked)}
                          />
                          <Label htmlFor="showIPs">IPアドレス一覧を表示</Label>
                        </div>
                        
                        {showIPList && (
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="maxIPs">最大表示数:</Label>
                            <Select
                              value={maxIPsToShow.toString()}
                              onValueChange={(value) => setMaxIPsToShow(parseInt(value))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="64">64</SelectItem>
                                <SelectItem value="128">128</SelectItem>
                                <SelectItem value="256">256</SelectItem>
                                <SelectItem value="512">512</SelectItem>
                                <SelectItem value="1024">1024</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {showIPList && cidrInfo.totalAddresses <= maxIPsToShow && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              {cidrInfo.totalAddresses}個のIPアドレス
                            </span>
                            <CopyButton text={generateIPList(cidrInfo).join('\n')} />
                          </div>
                          <div className="bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-1 font-mono text-xs">
                              {generateIPList(cidrInfo).map((ip, index) => (
                                <div
                                  key={index}
                                  className={`p-1 rounded text-center ${
                                    index === 0 ? 'bg-blue-100 text-blue-800' :
                                    index === cidrInfo.totalAddresses - 1 ? 'bg-red-100 text-red-800' :
                                    'hover:bg-gray-200'
                                  }`}
                                  title={
                                    index === 0 ? 'ネットワークアドレス' :
                                    index === cidrInfo.totalAddresses - 1 ? 'ブロードキャストアドレス' :
                                    '利用可能IP'
                                  }
                                >
                                  {ip}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {showIPList && cidrInfo.totalAddresses > maxIPsToShow && (
                        <div className="text-center py-4 text-gray-600">
                          <p>IPアドレス数が多すぎます ({formatNumber(cidrInfo.totalAddresses)}個)</p>
                          <p>最大表示数を増やすか、より小さなサブネットを使用してください</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>CIDR計算機について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">CIDR記法</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>CIDR</strong>: Classless Inter-Domain Routing</li>
                  <li><strong>記法</strong>: IPアドレス/プレフィックス長 (例: 192.168.1.0/24)</li>
                  <li><strong>プレフィックス長</strong>: ネットワーク部のビット数 (0-32)</li>
                  <li><strong>/24</strong>: 255.255.255.0と同等（クラスCサブネット）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">プライベートIPアドレス</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>クラスA</strong>: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)</li>
                  <li><strong>クラスB</strong>: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)</li>
                  <li><strong>クラスC</strong>: 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">サブネット設計のコツ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>必要なホスト数より大きめのサブネットを設計</li>
                  <li>将来の拡張を考慮してゆとりを持たせる</li>
                  <li>大きなサブネットから順番に割り当てる</li>
                  <li>管理しやすい規則的な番号体系を採用</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ネットワークアドレスとブロードキャストアドレスは使用不可</li>
                  <li>プレフィックス長が短いほど大きなネットワーク</li>
                  <li>/30は2つのホストのみ（ポイントツーポイント）</li>
                  <li>/32は単一ホスト（ホストルート）</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
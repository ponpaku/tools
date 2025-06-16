"use client";

import { useState, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'SRV' | 'PTR';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  weight?: number;
  port?: number;
}

interface DNSTemplate {
  domain: string;
  records: Omit<DNSRecord, 'id'>[];
}

const RECORD_TYPES = [
  { value: 'A', label: 'A', description: 'IPv4アドレス' },
  { value: 'AAAA', label: 'AAAA', description: 'IPv6アドレス' },
  { value: 'CNAME', label: 'CNAME', description: '別名レコード' },
  { value: 'MX', label: 'MX', description: 'メールサーバー' },
  { value: 'TXT', label: 'TXT', description: 'テキストレコード' },
  { value: 'NS', label: 'NS', description: 'ネームサーバー' },
  { value: 'SOA', label: 'SOA', description: '権威レコード' },
  { value: 'SRV', label: 'SRV', description: 'サービスレコード' },
  { value: 'PTR', label: 'PTR', description: '逆引きレコード' }
] as const;

const TTL_PRESETS = [
  { value: 300, label: '5分', description: 'テスト・開発用' },
  { value: 900, label: '15分', description: '変更頻度の高い設定' },
  { value: 3600, label: '1時間', description: '一般的な設定' },
  { value: 14400, label: '4時間', description: '安定した設定' },
  { value: 86400, label: '24時間', description: '長期間不変な設定' }
];

const COMMON_TEMPLATES = {
  basic: {
    name: '基本的なWebサイト',
    records: [
      { type: 'A' as const, name: '@', value: '192.0.2.1', ttl: 3600 },
      { type: 'A' as const, name: 'www', value: '192.0.2.1', ttl: 3600 },
      { type: 'CNAME' as const, name: 'mail', value: 'example.com', ttl: 3600 }
    ]
  },
  email: {
    name: 'メールサーバー設定',
    records: [
      { type: 'MX' as const, name: '@', value: 'mail.example.com', ttl: 3600, priority: 10 },
      { type: 'A' as const, name: 'mail', value: '192.0.2.2', ttl: 3600 },
      { type: 'TXT' as const, name: '@', value: 'v=spf1 include:_spf.example.com ~all', ttl: 3600 },
      { type: 'TXT' as const, name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com', ttl: 3600 }
    ]
  },
  cdn: {
    name: 'CDN設定',
    records: [
      { type: 'A' as const, name: '@', value: '192.0.2.1', ttl: 3600 },
      { type: 'CNAME' as const, name: 'www', value: 'cdn.example.com', ttl: 3600 },
      { type: 'CNAME' as const, name: 'static', value: 'cdn.example.com', ttl: 14400 },
      { type: 'CNAME' as const, name: 'assets', value: 'cdn.example.com', ttl: 14400 }
    ]
  },
  subdomain: {
    name: 'サブドメイン設定',
    records: [
      { type: 'A' as const, name: 'api', value: '192.0.2.3', ttl: 3600 },
      { type: 'A' as const, name: 'app', value: '192.0.2.4', ttl: 3600 },
      { type: 'CNAME' as const, name: 'blog', value: 'blog.hosting.com', ttl: 3600 },
      { type: 'CNAME' as const, name: 'shop', value: 'shop.platform.com', ttl: 3600 }
    ]
  }
};

export default function DNSGeneratorPage() {
  const [domain, setDomain] = useState('example.com');
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<DNSRecord>>({
    type: 'A',
    name: '@',
    value: '',
    ttl: 3600
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addRecord = () => {
    if (!newRecord.name || !newRecord.value) return;

    const record: DNSRecord = {
      id: generateId(),
      type: newRecord.type as DNSRecord['type'],
      name: newRecord.name,
      value: newRecord.value,
      ttl: newRecord.ttl || 3600,
      priority: newRecord.priority,
      weight: newRecord.weight,
      port: newRecord.port
    };

    setRecords([...records, record]);
    setNewRecord({
      type: 'A',
      name: '',
      value: '',
      ttl: 3600
    });
  };

  const removeRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const updateRecord = (id: string, updates: Partial<DNSRecord>) => {
    setRecords(records.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const applyTemplate = (templateKey: keyof typeof COMMON_TEMPLATES) => {
    const template = COMMON_TEMPLATES[templateKey];
    const templateRecords: DNSRecord[] = template.records.map(r => ({
      ...r,
      id: generateId()
    }));
    setRecords(templateRecords);
  };

  const clearRecords = () => {
    setRecords([]);
  };

  const generateZoneFile = useCallback((): string => {
    if (records.length === 0) return '';

    let zoneFile = `; DNS Zone file for ${domain}\n`;
    zoneFile += `; Generated on ${new Date().toISOString()}\n\n`;
    
    // SOAレコードがある場合は最初に出力
    const soaRecord = records.find(r => r.type === 'SOA');
    if (soaRecord) {
      zoneFile += `${soaRecord.name.padEnd(20)} ${soaRecord.ttl.toString().padEnd(8)} IN SOA ${soaRecord.value}\n\n`;
    }

    // NSレコードを次に出力
    const nsRecords = records.filter(r => r.type === 'NS');
    if (nsRecords.length > 0) {
      nsRecords.forEach(record => {
        zoneFile += `${record.name.padEnd(20)} ${record.ttl.toString().padEnd(8)} IN NS  ${record.value}\n`;
      });
      zoneFile += '\n';
    }

    // その他のレコードタイプ別に出力
    const otherRecords = records.filter(r => r.type !== 'SOA' && r.type !== 'NS');
    const recordsByType = otherRecords.reduce((acc, record) => {
      if (!acc[record.type]) acc[record.type] = [];
      acc[record.type].push(record);
      return acc;
    }, {} as Record<string, DNSRecord[]>);

    Object.entries(recordsByType).forEach(([type, typeRecords]) => {
      typeRecords.forEach(record => {
        let line = `${record.name.padEnd(20)} ${record.ttl.toString().padEnd(8)} IN ${type.padEnd(5)}`;
        
        if (record.type === 'MX' && record.priority !== undefined) {
          line += ` ${record.priority.toString().padEnd(3)} ${record.value}`;
        } else if (record.type === 'SRV' && record.priority !== undefined && record.weight !== undefined && record.port !== undefined) {
          line += ` ${record.priority} ${record.weight} ${record.port} ${record.value}`;
        } else {
          line += ` ${record.value}`;
        }
        
        zoneFile += line + '\n';
      });
    });

    return zoneFile;
  }, [domain, records]);

  const generateBindFormat = useCallback((): string => {
    if (records.length === 0) return '';

    let bindConfig = `zone "${domain}" {\n`;
    bindConfig += `    type master;\n`;
    bindConfig += `    file "/etc/bind/zones/${domain}.db";\n`;
    bindConfig += `};\n\n`;
    
    bindConfig += `// Zone file content for ${domain}.db:\n`;
    bindConfig += generateZoneFile();
    
    return bindConfig;
  }, [domain, generateZoneFile]);

  const generateJSON = useCallback((): string => {
    const template: DNSTemplate = {
      domain,
      records: records.map(({ id, ...record }) => record)
    };
    return JSON.stringify(template, null, 2);
  }, [domain, records]);

  const validateRecord = (record: Partial<DNSRecord>): string[] => {
    const errors: string[] = [];
    
    if (!record.name) errors.push('名前は必須です');
    if (!record.value) errors.push('値は必須です');
    
    if (record.type === 'A' && record.value) {
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(record.value)) {
        errors.push('有効なIPv4アドレスを入力してください');
      }
    }
    
    if (record.type === 'AAAA' && record.value) {
      const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      if (!ipv6Regex.test(record.value.replace(/::/, ':0:0:0:0:0:0:0:'))) {
        errors.push('有効なIPv6アドレスを入力してください');
      }
    }
    
    if (record.type === 'MX' && record.priority === undefined) {
      errors.push('MXレコードには優先度が必要です');
    }
    
    return errors;
  };

  const recordErrors = validateRecord(newRecord);

  return (
    <ToolLayout
      title="DNSレコード生成ツール"
      description="DNS設定のテンプレートを生成・管理するツール"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ドメイン設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">ドメイン名</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              
              <div>
                <Label>テンプレートから開始</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {Object.entries(COMMON_TEMPLATES).map(([key, template]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(key as keyof typeof COMMON_TEMPLATES)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DNSレコード追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="recordType">タイプ</Label>
                  <Select 
                    value={newRecord.type} 
                    onValueChange={(value) => setNewRecord({...newRecord, type: value as DNSRecord['type']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECORD_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="recordName">名前</Label>
                  <Input
                    id="recordName"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                    placeholder="@, www, mail など"
                  />
                </div>

                <div>
                  <Label htmlFor="recordValue">値</Label>
                  <Input
                    id="recordValue"
                    value={newRecord.value}
                    onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                    placeholder={
                      newRecord.type === 'A' ? '192.0.2.1' :
                      newRecord.type === 'AAAA' ? '2001:db8::1' :
                      newRecord.type === 'CNAME' ? 'example.com' :
                      newRecord.type === 'MX' ? 'mail.example.com' :
                      'レコード値'
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="recordTTL">TTL</Label>
                  <Select 
                    value={newRecord.ttl?.toString()} 
                    onValueChange={(value) => setNewRecord({...newRecord, ttl: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TTL_PRESETS.map(preset => (
                        <SelectItem key={preset.value} value={preset.value.toString()}>
                          {preset.label} ({preset.description})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(newRecord.type === 'MX' || newRecord.type === 'SRV') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">優先度</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={newRecord.priority || ''}
                      onChange={(e) => setNewRecord({...newRecord, priority: parseInt(e.target.value) || undefined})}
                      placeholder="10"
                    />
                  </div>
                  {newRecord.type === 'SRV' && (
                    <>
                      <div>
                        <Label htmlFor="weight">重み</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={newRecord.weight || ''}
                          onChange={(e) => setNewRecord({...newRecord, weight: parseInt(e.target.value) || undefined})}
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="port">ポート</Label>
                        <Input
                          id="port"
                          type="number"
                          value={newRecord.port || ''}
                          onChange={(e) => setNewRecord({...newRecord, port: parseInt(e.target.value) || undefined})}
                          placeholder="443"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {recordErrors.length > 0 && (
                <div className="text-sm text-red-600">
                  <ul className="list-disc list-inside">
                    {recordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={addRecord}
                  disabled={recordErrors.length > 0}
                >
                  レコードを追加
                </Button>
                <Button 
                  onClick={clearRecords}
                  variant="outline"
                >
                  全クリア
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>設定されたDNSレコード ({records.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{record.type}</Badge>
                      <div className="font-mono text-sm">
                        <span className="text-gray-600">{record.name}</span>
                        <span className="mx-2">→</span>
                        <span>{record.value}</span>
                        {record.priority !== undefined && (
                          <span className="text-gray-600 ml-2">(優先度: {record.priority})</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        TTL: {record.ttl}s
                      </div>
                    </div>
                    <Button
                      onClick={() => removeRecord(record.id)}
                      variant="outline"
                      size="sm"
                    >
                      削除
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>生成されたDNS設定</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="zonefile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="zonefile">ゾーンファイル</TabsTrigger>
                  <TabsTrigger value="bind">BIND設定</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="zonefile" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>ゾーンファイル形式</Label>
                      <CopyButton text={generateZoneFile()} />
                    </div>
                    <Textarea
                      value={generateZoneFile()}
                      readOnly
                      className="h-64 font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="bind" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>BIND設定ファイル</Label>
                      <CopyButton text={generateBindFormat()} />
                    </div>
                    <Textarea
                      value={generateBindFormat()}
                      readOnly
                      className="h-64 font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="json" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>JSON形式</Label>
                      <CopyButton text={generateJSON()} />
                    </div>
                    <Textarea
                      value={generateJSON()}
                      readOnly
                      className="h-64 font-mono text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>DNSレコードについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">主要なレコードタイプ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>A</strong>: ドメインをIPv4アドレスに対応させる</li>
                  <li><strong>AAAA</strong>: ドメインをIPv6アドレスに対応させる</li>
                  <li><strong>CNAME</strong>: ドメインを別のドメイン名に対応させる</li>
                  <li><strong>MX</strong>: メールサーバーを指定する（優先度付き）</li>
                  <li><strong>TXT</strong>: テキスト情報を格納（SPF、DKIM、DMARECなど）</li>
                  <li><strong>NS</strong>: ネームサーバーを指定する</li>
                  <li><strong>SOA</strong>: ゾーンの権威情報を定義する</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">TTL（Time To Live）の設定</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>短い（5-15分）</strong>: テスト時や頻繁に変更する設定</li>
                  <li><strong>標準（1-4時間）</strong>: 一般的なWebサイトの設定</li>
                  <li><strong>長い（24時間）</strong>: 長期間変更しない安定した設定</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">よくある設定例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>@</strong>: ルートドメイン（example.com）を表す</li>
                  <li><strong>www</strong>: www.example.com を表す</li>
                  <li><strong>mail</strong>: mail.example.com を表す</li>
                  <li><strong>*</strong>: ワイルドカード（すべてのサブドメイン）</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>DNS変更は反映に時間がかかる場合があります（最大48時間）</li>
                  <li>CNAMEレコードは他のレコードタイプと同じ名前で設定できません</li>
                  <li>MXレコードの優先度は数値が小さいほど高い優先度になります</li>
                  <li>本番環境での変更前は必ずテスト環境で動作確認してください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
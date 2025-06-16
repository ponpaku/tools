"use client";

import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FortuneData {
	type: string;
	result: string;
	details: string;
	advice: string;
	luckyItem: string;
	luckyColor: string;
	luckyNumber: number;
	date: string;
	name: string;
}

const fortuneTypes = {
	omikuji: {
		name: "おみくじ",
		icon: "🏮",
		results: [
			{
				result: "大吉",
				details: "素晴らしい運勢です。何事も順調に進むでしょう。",
				advice: "積極的に行動し、チャンスを逃さないようにしましょう。",
			},
			{
				result: "中吉",
				details: "良い運勢です。努力が実を結びそうです。",
				advice: "継続することで更なる幸運が訪れるでしょう。",
			},
			{
				result: "小吉",
				details: "まずまずの運勢です。小さな幸せが見つかりそう。",
				advice: "身近なことから感謝の気持ちを持ちましょう。",
			},
			{
				result: "吉",
				details: "穏やかな運勢です。平和な日々が続くでしょう。",
				advice: "今の状況を大切にし、安定を心がけましょう。",
			},
			{
				result: "末吉",
				details: "後半に向けて運気が上昇します。",
				advice: "焦らず、じっくりと時期を待ちましょう。",
			},
			{
				result: "凶",
				details: "注意が必要な時期です。慎重に行動しましょう。",
				advice: "無理をせず、周囲の人に相談することも大切です。",
			},
		],
	},
	tarot: {
		name: "タロット占い",
		icon: "🔮",
		results: [
			{
				result: "太陽",
				details: "成功と幸福が約束されています。",
				advice: "自信を持って前進しましょう。明るい未来が待っています。",
			},
			{
				result: "星",
				details: "希望と願いが叶う暗示があります。",
				advice: "夢を諦めず、信念を持ち続けることが大切です。",
			},
			{
				result: "恋人",
				details: "人間関係において重要な選択の時です。",
				advice: "心の声に耳を傾け、真の愛を見つけましょう。",
			},
			{
				result: "正義",
				details: "バランスと公正さが重要な時期です。",
				advice: "正しい判断を心がけ、誠実に行動しましょう。",
			},
			{
				result: "隠者",
				details: "内省と自己発見の時期です。",
				advice: "一人の時間を大切にし、内なる声に耳を傾けましょう。",
			},
			{
				result: "死神",
				details: "終わりと新しい始まりを表します。",
				advice: "変化を恐れず、新たなスタートを切りましょう。",
			},
			{
				result: "魔術師",
				details: "創造力と可能性に満ちています。",
				advice: "自分の能力を信じ、新しいことに挑戦しましょう。",
			},
			{
				result: "女帝",
				details: "豊穣と創造性の象徴です。",
				advice: "愛情と思いやりを大切にし、周りを育みましょう。",
			},
		],
	},
};

const luckyItems = [
	"財布",
	"鍵",
	"時計",
	"ペン",
	"ハンカチ",
	"アクセサリー",
	"手帳",
	"スマートフォン",
	"花",
	"本",
	"お守り",
	"コーヒー",
	"紅茶",
	"チョコレート",
	"写真",
	"音楽",
];

const luckyColors = [
	"赤",
	"青",
	"緑",
	"黄色",
	"紫",
	"ピンク",
	"オレンジ",
	"白",
	"黒",
	"茶色",
	"金色",
	"銀色",
];

export default function FortuneGeneratorTool() {
	const [name, setName] = useState("");
	const [fortuneType, setFortuneType] =
		useState<keyof typeof fortuneTypes>("omikuji");
	const [result, setResult] = useState<FortuneData | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [animationStep, setAnimationStep] = useState(0);

	// ローカルストレージからの結果読み込み
	useEffect(() => {
		const today = new Date().toDateString();
		const savedResult = localStorage.getItem(`fortune-${fortuneType}-${today}`);

		if (savedResult) {
			try {
				const parsedResult = JSON.parse(savedResult);
				setResult(parsedResult);
				setName(parsedResult.name || "");
			} catch (error) {
				// 無効なデータの場合は削除
				localStorage.removeItem(`fortune-${fortuneType}-${today}`);
			}
		} else {
			setResult(null);
		}
	}, [fortuneType]);

	// 前日以前のデータをクリーンアップ
	useEffect(() => {
		const today = new Date().toDateString();
		const keys = Object.keys(localStorage).filter((key) =>
			key.startsWith("fortune-")
		);

		keys.forEach((key) => {
			try {
				const data = JSON.parse(localStorage.getItem(key) || "{}");
				if (data.date !== today) {
					localStorage.removeItem(key);
				}
			} catch (error) {
				localStorage.removeItem(key);
			}
		});
	}, []);

	const generateFortune = async () => {
		if (isGenerating) return;

		setIsGenerating(true);
		setAnimationStep(0);
		setResult(null);

		// 演出アニメーション（占いの種類に応じて変更）
		const steps =
			fortuneType === "omikuji"
				? [
						{ text: "神様に祈りを捧げます...", delay: 1000 },
						{ text: "御神籤を振っています...", delay: 1000 },
						{ text: "運勢を読み取っています...", delay: 1000 },
						{ text: "神託を受け取っています...", delay: 800 },
				  ]
				: [
						{ text: "カードをシャッフルしています...", delay: 1000 },
						{ text: "宇宙のエネルギーを受け取ります...", delay: 1000 },
						{ text: "あなたの運命を読み解いています...", delay: 1000 },
						{ text: "カードからのメッセージを受信中...", delay: 800 },
				  ];

		for (let i = 0; i < steps.length; i++) {
			setAnimationStep(i);
			await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
		}

		// 占い結果生成
		const typeData = fortuneTypes[fortuneType];
		const randomResult =
			typeData.results[Math.floor(Math.random() * typeData.results.length)];
		const luckyItem = luckyItems[Math.floor(Math.random() * luckyItems.length)];
		const luckyColor =
			luckyColors[Math.floor(Math.random() * luckyColors.length)];
		const luckyNumber = Math.floor(Math.random() * 100) + 1;
		const today = new Date().toDateString();

		const fortuneResult: FortuneData = {
			type: typeData.name,
			result: randomResult.result,
			details: randomResult.details,
			advice: randomResult.advice,
			luckyItem,
			luckyColor,
			luckyNumber,
			date: today,
			name: name,
		};

		// ローカルストレージに保存
		localStorage.setItem(
			`fortune-${fortuneType}-${today}`,
			JSON.stringify(fortuneResult)
		);

		setResult(fortuneResult);
		setIsGenerating(false);
		setAnimationStep(0);
	};

	const resetFortune = () => {
		const today = new Date().toDateString();
		localStorage.removeItem(`fortune-${fortuneType}-${today}`);
		setResult(null);
	};

	const generateResultText = () => {
		if (!result) return "";

		return `【${result.type}結果】${result.date}
${result.name ? `お名前: ${result.name}` : ""}
結果: ${result.result}

${result.details}

${result.advice}

ラッキーアイテム: ${result.luckyItem}
ラッキーカラー: ${result.luckyColor}
ラッキーナンバー: ${result.luckyNumber}

※これは娯楽目的の占いです。参考程度にお楽しみください。
`;
	};

	const getLoadingMessage = () => {
		const messages =
			fortuneType === "omikuji"
				? [
						"神様に祈りを捧げています...",
						"御神籤を振っています...",
						"運勢を読み取っています...",
						"神託を受け取っています...",
				  ]
				: [
						"カードをシャッフルしています...",
						"宇宙のエネルギーを感じています...",
						"あなたの運命を読み解いています...",
						"カードからのメッセージを受信中...",
				  ];
		return messages[animationStep] || messages[0];
	};

	const hasResultToday = Boolean(result && result.date === new Date().toDateString());

	return (
		<ToolLayout
			title="運勢・診断生成器"
			description="おみくじ・タロット占いで今日の運勢をチェック"
		>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{fortuneTypes[fortuneType].icon} 占い設定
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2" htmlFor="name">
								お名前（任意）
							</label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="お名前を入力してください"
								disabled={hasResultToday}
							/>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-2"
								htmlFor="fortuneType"
							>
								占いの種類
							</label>
							<Select
								value={fortuneType}
								onValueChange={(value: keyof typeof fortuneTypes) =>
									setFortuneType(value)
								}
								disabled={isGenerating}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(fortuneTypes).map(([key, type]) => (
										<SelectItem key={key} value={key}>
											{type.icon} {type.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{hasResultToday ? (
							<div className="space-y-2">
								<p className="text-sm text-gray-600">
									本日の{result?.type}は既に実行済みです。
								</p>
								<Button
									onClick={resetFortune}
									variant="outline"
									className="w-full"
								>
									もう一度占う
								</Button>
							</div>
						) : (
							<Button
								onClick={generateFortune}
								className="w-full"
								disabled={isGenerating}
							>
								{isGenerating ? (
									<div className="flex items-center gap-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										占いを実行中...
									</div>
								) : (
									`${fortuneTypes[fortuneType].name}を引く`
								)}
							</Button>
						)}
					</CardContent>
				</Card>

				{isGenerating && (
					<Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
						<CardContent className="p-8">
							<div className="text-center space-y-4">
								<div className="text-4xl animate-pulse">
									{fortuneTypes[fortuneType].icon}
								</div>
								<div className="text-lg font-medium text-purple-700 animate-pulse">
									{getLoadingMessage()}
								</div>
								<div className="flex justify-center space-x-1">
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											className={`w-2 h-2 bg-purple-400 rounded-full animate-bounce`}
											style={{ animationDelay: `${i * 0.2}s` }}
										/>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{result && !isGenerating && (
					<Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 animate-in slide-in-from-bottom duration-700">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="text-purple-800 flex items-center gap-2">
									{fortuneTypes[fortuneType].icon}
									{result.type}の結果
									{result.name && (
										<span className="text-lg ml-2">- {result.name}さん</span>
									)}
								</CardTitle>
								<CopyButton text={generateResultText()} />
							</div>
							<p className="text-sm text-purple-600">{result.date} の運勢</p>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="text-center animate-in fade-in-50 duration-1000">
								<div className="text-4xl font-bold text-purple-700 mb-4 animate-in zoom-in-50 duration-500">
									{result.result}
								</div>
								<p className="text-gray-700 text-lg leading-relaxed">
									{result.details}
								</p>
							</div>

							<div className="bg-white/70 p-4 rounded-lg animate-in slide-in-from-left duration-500 delay-300">
								<h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
									💫 アドバイス
								</h4>
								<p className="text-gray-700 leading-relaxed">{result.advice}</p>
							</div>

							<div className="grid grid-cols-3 gap-4 mt-4">
								<div className="text-center bg-white/70 p-3 rounded-lg animate-in slide-in-from-bottom duration-500 delay-500">
									<div className="text-sm text-gray-600">ラッキーアイテム</div>
									<div className="font-semibold text-purple-700 text-lg">
										{result.luckyItem}
									</div>
								</div>
								<div className="text-center bg-white/70 p-3 rounded-lg animate-in slide-in-from-bottom duration-500 delay-700">
									<div className="text-sm text-gray-600">ラッキーカラー</div>
									<div className="font-semibold text-purple-700 text-lg">
										{result.luckyColor}
									</div>
								</div>
								<div className="text-center bg-white/70 p-3 rounded-lg animate-in slide-in-from-bottom duration-500 delay-1000">
									<div className="text-sm text-gray-600">ラッキーナンバー</div>
									<div className="font-semibold text-purple-700 text-lg">
										{result.luckyNumber}
									</div>
								</div>
							</div>

							{hasResultToday && (
								<div className="text-center pt-4 border-t border-purple-200">
									<p className="text-sm text-purple-600 mb-2">
										この結果は今日一日有効です ✨
									</p>
									<Button
										onClick={resetFortune}
										variant="outline"
										size="sm"
										className="text-purple-700 border-purple-300 hover:bg-purple-50"
									>
										新しく占い直す
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>占いについて</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 text-sm text-gray-600">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold mb-2 flex items-center gap-2">
										🏮 おみくじ
									</h4>
									<p>
										日本の伝統的な占い。神社やお寺で引くくじで、運勢を占います。大吉から凶まで様々な結果があり、一日の指針となります。
									</p>
								</div>

								<div>
									<h4 className="font-semibold mb-2 flex items-center gap-2">
										🔮 タロット占い
									</h4>
									<p>
										78枚のカードを使った西洋の占術。各カードには象徴的な意味があり、人生の指針や深層心理を示してくれます。
									</p>
								</div>
							</div>

							<div className="mt-6 p-4 bg-blue-50 rounded-lg">
								<h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
									💾 結果の保存について
								</h4>
								<ul className="list-disc list-inside space-y-1 text-blue-700">
									<li>占い結果は一日（深夜0時まで）保存されます</li>
									<li>同じ占いは一日一回まで実行可能です</li>
									<li>日付が変わると自動的にリセットされます</li>
									<li>「新しく占い直す」で強制的にリセットできます</li>
								</ul>
							</div>

							<div className="mt-6 p-4 bg-yellow-50 rounded-lg">
								<h4 className="font-semibold mb-2 text-yellow-800">
									ご利用にあたって
								</h4>
								<ul className="list-disc list-inside space-y-1 text-yellow-700">
									<li>この占いは娯楽目的で作成されています</li>
									<li>結果は参考程度にお楽しみください</li>
									<li>重要な決断は自分自身でよく考えて行いましょう</li>
									<li>
										ポジティブな気持ちで日々を過ごすきっかけとしてご活用ください
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-2">こんな時におすすめ</h4>
								<ul className="list-disc list-inside space-y-1">
									<li>朝の運勢チェックとして</li>
									<li>友達や家族との話題作りに</li>
									<li>新しいことを始める前の気分転換に</li>
									<li>イベントやパーティーの余興として</li>
									<li>SNSでのシェアネタとして</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</ToolLayout>
	);
}

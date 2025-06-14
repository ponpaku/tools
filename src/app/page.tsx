"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock, Zap } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";
import { toolsConfig } from "@/lib/tools-config";
import { Tool } from "@/types";
import { HomePageAd } from "@/components/ads/ad-wrapper";

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");

	// 人気ツール（アクセス頻度が高そうなもの）
	const popularTools = [
		"character-counter",
		"base64",
		"qr-generator",
		"json-formatter",
		"hash-generator",
		"full-half-converter",
	];

	// 更新履歴
	const updateHistory = [
		{ date: "2024-01-15", description: "ルーレット判定バグを修正" },
		{ date: "2024-01-10", description: "ゲームカテゴリを追加" },
		{ date: "2024-01-05", description: "スコアボード機能を追加" },
		{ date: "2024-01-01", description: "電子レンジ時間計算器を追加" },
	];

	const allTools = useMemo(() => {
		return toolsConfig.categories.flatMap((category) =>
			category.tools.map((tool) => ({
				...tool,
				categoryName: category.name,
				categoryIcon: category.icon,
			}))
		);
	}, []);

	const filteredTools = useMemo(() => {
		if (!searchQuery.trim()) return allTools;

		return allTools.filter(
			(tool) =>
				tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tool.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [allTools, searchQuery]);

	const getIcon = (iconName: string) => {
		const iconMap: Record<string, string> = {
			Type: "📝",
			Lock: "🔒",
			Calendar: "📅",
			Code: "💻",
			Sparkles: "✨",
			Settings: "⚙️",
		};
		return iconMap[iconName] || "🔧";
	};

	const getToolIcon = (iconName: string) => {
		const iconMap: Record<string, string> = {
			Calculator: "🧮",
			ArrowLeftRight: "↔️",
			CaseSensitive: "Aa",
			RemoveFormatting: "📄",
			Highlighter: "🖍️",
			GitCompare: "🔍",
			Key: "🔑",
			Link: "🔗",
			Hash: "#️⃣",
			Birthday: "🎂",
			CalendarDays: "📆",
			Clock: "⏰",
			Flower: "🌸",
			Languages: "🈯",
			Braces: "{}",
			FileText: "📄",
			Timer: "⏱️",
			Search: "🔍",
			QrCode: "📱",
			Dices: "🎲",
			ShoppingCart: "🛒",
			Globe: "🌐",
			Image: "🖼️",
			Gauge: "📊",
			Zap: "⚡",
			Trophy: "🏆",
			CircleDot: "⭕",
			Grid3X3: "🔳",
			RotateCcw: "🔄",
			Gamepad2: "🎮",
		};
		return iconMap[iconName] || "🔧";
	};

	const ToolCard = ({
		tool,
		showCategory = true,
		featured = false,
	}: {
		tool: Tool & { categoryName: string; categoryIcon: string };
		showCategory?: boolean;
		featured?: boolean;
	}) => (
		<Link href={tool.path}>
			<Card
				className={`h-full hover:shadow-lg hover:shadow-blue-100 transition-all duration-200 cursor-pointer group border-l-4 ${
					featured
						? "border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white"
						: "border-l-blue-400"
				}`}
			>
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-2">
							<div className="text-2xl">{getToolIcon(tool.icon)}</div>
							{featured && (
								<Star className="h-4 w-4 text-yellow-500 fill-current" />
							)}
						</div>
						{showCategory && (
							<Badge variant="secondary" className="text-xs">
								<span className="mr-1">{getIcon(tool.categoryIcon)}</span>
								{tool.categoryName}
							</Badge>
						)}
					</div>
					<CardTitle className="group-hover:text-blue-600 transition-colors text-lg">
						{tool.name}
					</CardTitle>
					<CardDescription className="text-sm leading-relaxed">
						{tool.description}
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);

	return (
		<AppLayout showCard={false}>
			<div className="space-y-8">
				{/* ヒーローセクション */}
				<section className="text-center py-12 px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							ぽんぱく
							<span className="text-blue-600">ツール</span>
						</h1>
						<p className="text-xl text-gray-600 mb-8 leading-relaxed">
							日常業務を効率化する便利なオンラインツールボックス
							<br />
							ブラウザ上ですぐに使える実用的なツールを無料で提供しています
						</p>

						{/* 検索バー */}
						<div className="relative max-w-2xl mx-auto mb-8">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="ツールを検索... (例: Base64, QRコード, JSON)"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 h-12 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl"
							/>
						</div>
					</div>
				</section>

				{/* 検索結果または人気ツール */}
				{searchQuery.trim() ? (
					<section>
						<div className="flex items-center space-x-2 mb-6">
							<Search className="h-6 w-6 text-blue-600" />
							<h2 className="text-2xl font-bold text-gray-900">
								検索結果 ({filteredTools.length}件)
							</h2>
						</div>

						{filteredTools.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredTools.map((tool) => (
									<ToolCard key={tool.id} tool={tool} />
								))}
							</div>
						) : (
							<Card className="text-center py-12">
								<CardContent>
									<div className="text-6xl mb-4">🔍</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										検索結果が見つかりませんでした
									</h3>
									<p className="text-gray-600 mb-4">
										別のキーワードで検索するか、下記の人気ツールをお試しください
									</p>
									<Button onClick={() => setSearchQuery("")} variant="outline">
										検索をクリア
									</Button>
								</CardContent>
							</Card>
						)}
					</section>
				) : (
					<>
						{/* 人気ツール */}
						<section>
							<div className="flex items-center space-x-2 mb-6">
								<TrendingUp className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-bold text-gray-900">人気ツール</h2>
								<Badge className="bg-blue-100 text-blue-700">
									<Star className="h-3 w-3 mr-1" />
									おすすめ
								</Badge>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{allTools
									.filter((tool) => popularTools.includes(tool.id))
									.map((tool) => (
										<ToolCard key={tool.id} tool={tool} featured />
									))}
							</div>
						</section>

						{/* 広告エリア1: 人気ツールの後 */}
						<HomePageAd className="mx-auto max-w-2xl" />

						{/* 更新履歴 */}
						<section>
							<div className="flex items-center space-x-2 mb-6">
								<Clock className="h-6 w-6 text-green-600" />
								<h2 className="text-2xl font-bold text-gray-900">
									更新履歴
								</h2>
							</div>

							<Card className="mb-12">
								<CardContent className="p-6">
									<div className="space-y-4">
										{updateHistory.map((update, index) => (
											<div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50">
												<div className="text-sm text-green-600 font-medium min-w-[80px]">
													{update.date}
												</div>
												<div className="text-sm text-gray-700">
													{update.description}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</section>

						{/* 広告エリア2: 更新履歴の後 */}
						<HomePageAd className="mx-auto max-w-2xl" />

						{/* カテゴリ別ツール */}
						<section>
							<div className="flex items-center space-x-2 mb-6">
								<div className="text-2xl">📁</div>
								<h2 className="text-2xl font-bold text-gray-900">
									カテゴリ別ツール
								</h2>
							</div>

							<div className="space-y-8">
								{toolsConfig.categories.map((category) => (
									<div key={category.id}>
										<div className="flex items-center space-x-3 mb-4">
											<span className="text-2xl">{getIcon(category.icon)}</span>
											<h3 className="text-xl font-semibold text-gray-900">
												{category.name}
											</h3>
											<Badge variant="secondary">
												{category.tools.length}個
											</Badge>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{category.tools.map((tool) => (
												<ToolCard
													key={tool.id}
													tool={{
														...tool,
														categoryName: category.name,
														categoryIcon: category.icon,
													}}
													showCategory={false}
												/>
											))}
										</div>
									</div>
								))}
							</div>
						</section>

						{/* 特徴セクション */}
						<section className="bg-white rounded-2xl p-8 mt-12">
							<h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
								ぽんぱくツールの特徴
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="text-center">
									<div className="text-4xl mb-4">🚀</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										高速処理
									</h3>
									<p className="text-gray-600 text-sm">
										ブラウザ上で即座に動作し、サーバーへのアップロードは不要です
									</p>
								</div>

								<div className="text-center">
									<div className="text-4xl mb-4">🔒</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										プライバシー保護
									</h3>
									<p className="text-gray-600 text-sm">
										すべての処理はローカルで実行され、データは外部に送信されません
									</p>
								</div>

								<div className="text-center">
									<div className="text-4xl mb-4">📱</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										レスポンシブ対応
									</h3>
									<p className="text-gray-600 text-sm">
										PC、タブレット、スマートフォンのどのデバイスでも快適に利用可能
									</p>
								</div>

								<div className="text-center">
									<div className="text-4xl mb-4">💰</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										完全無料
									</h3>
									<p className="text-gray-600 text-sm">
										アカウント登録不要で、すべての機能を無料でご利用いただけます
									</p>
								</div>
							</div>
						</section>
					</>
				)}
			</div>
		</AppLayout>
	);
}

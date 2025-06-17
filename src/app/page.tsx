"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Star, TrendingUp, Clock, Zap, Filter, X, Heart, Pin } from "lucide-react";
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
import { getCategoryIcon, getToolIcon } from "@/lib/icon-map";
import { Tool } from "@/types";
import { HomePageAd } from "@/components/ads/ad-wrapper";

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [favoriteTools, setFavoriteTools] = useState<string[]>([]);

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
		{ date: "2025-06-17", description: "公開" },
	];

	// ローカルストレージからお気に入りツールを読み込み
	useEffect(() => {
		const savedFavorites = localStorage.getItem('favorite-tools');
		if (savedFavorites) {
			try {
				const favorites = JSON.parse(savedFavorites);
				setFavoriteTools(Array.isArray(favorites) ? favorites : []);
			} catch (error) {
				console.error('Failed to parse favorite tools from localStorage:', error);
			}
		}
	}, []);

	// お気に入りツールの追加/削除
	const toggleFavorite = (toolId: string) => {
		setFavoriteTools(prev => {
			const newFavorites = prev.includes(toolId)
				? prev.filter(id => id !== toolId)
				: [...prev, toolId];
			
			localStorage.setItem('favorite-tools', JSON.stringify(newFavorites));
			return newFavorites;
		});
	};

	const allTools = useMemo(() => {
		return toolsConfig.categories.flatMap((category) =>
			category.tools.map((tool) => ({
				...tool,
				categoryName: category.name,
				categoryIcon: category.icon,
			}))
		);
	}, []);

	const totalToolCount = useMemo(() => {
		return toolsConfig.categories.reduce((total, category) => total + category.tools.length, 0);
	}, []);

	const filteredTools = useMemo(() => {
		let filtered = allTools;

		// カテゴリフィルターを適用
		if (selectedCategories.length > 0) {
			filtered = filtered.filter(tool => 
				selectedCategories.includes(tool.category)
			);
		}

		// 検索クエリを適用
		if (searchQuery.trim()) {
			filtered = filtered.filter(
				(tool) =>
					tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					tool.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		return filtered;
	}, [allTools, searchQuery, selectedCategories]);

	// カテゴリフィルターの切り替え
	const toggleCategory = (categoryId: string) => {
		setSelectedCategories(prev => 
			prev.includes(categoryId)
				? prev.filter(id => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	// すべてのフィルターをクリア
	const clearAllFilters = () => {
		setSearchQuery("");
		setSelectedCategories([]);
	};

	const ToolCard = ({
		tool,
		showCategory = true,
		featured = false,
		showFavorite = true,
	}: {
		tool: Tool & { categoryName: string; categoryIcon: string };
		showCategory?: boolean;
		featured?: boolean;
		showFavorite?: boolean;
	}) => {
		const isFavorite = favoriteTools.includes(tool.id);
		
		return (
			<div className="relative">
				<Link href={tool.path}>
					<Card
						className={`h-full hover:shadow-lg hover:shadow-blue-100 transition-all duration-200 cursor-pointer group border-l-4 ${
							featured
								? "border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white"
								: isFavorite
								? "border-l-pink-400 bg-gradient-to-r from-pink-50 to-white"
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
									{isFavorite && (
										<Heart className="h-4 w-4 text-pink-500 fill-current" />
									)}
								</div>
								{showCategory && (
									<Badge variant="secondary" className="text-xs">
										<span className="mr-1">{getCategoryIcon(tool.categoryIcon)}</span>
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
				
				{/* お気に入りボタン */}
				{showFavorite && (
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleFavorite(tool.id);
						}}
						variant="ghost"
						size="sm"
						className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
							isFavorite ? "opacity-100" : ""
						}`}
					>
						<Heart className={`h-4 w-4 ${
							isFavorite 
								? "text-pink-500 fill-current" 
								: "text-gray-400 hover:text-pink-500"
						}`} />
					</Button>
				)}
			</div>
		);
	};

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

						{/* ツール数統計 */}
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 max-w-md mx-auto">
							<div className="text-center">
								<div className="text-3xl mb-2">🔧</div>
								<div className="text-3xl font-bold text-blue-600 mb-1">
									{totalToolCount}個
								</div>
								<div className="text-lg font-semibold text-gray-700 mb-1">
									のツールが利用可能
								</div>
								<div className="text-sm text-gray-500">
									すべて無料でご利用いただけます
								</div>
							</div>
						</div>

						{/* 検索バー */}
						<div className="relative max-w-2xl mx-auto mb-6">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="ツールを検索... (例: Base64, QRコード, JSON)"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 h-12 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl"
							/>
						</div>

						{/* カテゴリフィルター */}
						<div className="max-w-4xl mx-auto mb-8">
							<div className="flex items-center gap-2 mb-4">
								<Filter className="h-5 w-5 text-gray-600" />
								<span className="text-sm font-medium text-gray-700">カテゴリで絞り込み:</span>
								{(searchQuery.trim() || selectedCategories.length > 0) && (
									<Button
										onClick={clearAllFilters}
										variant="ghost"
										size="sm"
										className="ml-2 text-gray-500 hover:text-gray-700"
									>
										<X className="h-4 w-4 mr-1" />
										すべてクリア
									</Button>
								)}
							</div>
							
							<div className="flex flex-wrap gap-2">
								{toolsConfig.categories.map((category) => {
									const isSelected = selectedCategories.includes(category.id);
									const categoryToolCount = category.tools.length;
									
									return (
										<Button
											key={category.id}
											onClick={() => toggleCategory(category.id)}
											variant={isSelected ? "default" : "outline"}
											size="sm"
											className={`transition-all ${
												isSelected 
													? "bg-blue-600 hover:bg-blue-700 text-white" 
													: "hover:bg-blue-50 hover:border-blue-300"
											}`}
										>
											<span className="mr-2">{getCategoryIcon(category.icon)}</span>
											{category.name}
											<Badge 
												variant="secondary" 
												className={`ml-2 ${
													isSelected 
														? "bg-blue-500 text-white" 
														: "bg-gray-100 text-gray-600"
												}`}
											>
												{categoryToolCount}
											</Badge>
										</Button>
									);
								})}
							</div>
						</div>
					</div>
				</section>

				{/* 検索・フィルター結果または人気ツール */}
				{searchQuery.trim() || selectedCategories.length > 0 ? (
					<section>
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-2">
								<Search className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-bold text-gray-900">
									{searchQuery.trim() && selectedCategories.length > 0 
										? "検索・フィルター結果" 
										: searchQuery.trim() 
											? "検索結果"
											: "フィルター結果"
									} ({filteredTools.length}件)
								</h2>
							</div>
							
							{/* 適用中のフィルター表示 */}
							{selectedCategories.length > 0 && (
								<div className="flex items-center space-x-2">
									<span className="text-sm text-gray-600">フィルター:</span>
									<div className="flex flex-wrap gap-1">
										{selectedCategories.map((categoryId) => {
											const category = toolsConfig.categories.find(c => c.id === categoryId);
											if (!category) return null;
											
											return (
												<Badge key={categoryId} variant="default" className="text-xs">
													<span className="mr-1">{getCategoryIcon(category.icon)}</span>
													{category.name}
												</Badge>
											);
										})}
									</div>
								</div>
							)}
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
						{/* お気に入りツール */}
						{favoriteTools.length > 0 && (
							<section>
								<div className="flex items-center space-x-2 mb-6">
									<Heart className="h-6 w-6 text-pink-600" />
									<h2 className="text-2xl font-bold text-gray-900">お気に入りツール</h2>
									<Badge className="bg-pink-100 text-pink-700">
										<Pin className="h-3 w-3 mr-1" />
										{favoriteTools.length}個
									</Badge>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
									{allTools
										.filter((tool) => favoriteTools.includes(tool.id))
										.map((tool) => (
											<ToolCard key={tool.id} tool={tool} showCategory={true} />
										))}
								</div>
							</section>
						)}

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
											<span className="text-2xl">{getCategoryIcon(category.icon)}</span>
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

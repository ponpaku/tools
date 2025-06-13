"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExifData {
	[key: string]: any;
}

interface ProcessedExifData {
	basic: { [key: string]: any };
	camera: { [key: string]: any };
	settings: { [key: string]: any };
	gps: { [key: string]: any };
	technical: { [key: string]: any };
	debug: { [key: string]: any };
}

export default function ExifViewerPage() {
	const [exifData, setExifData] = useState<ProcessedExifData | null>(null);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [fileName, setFileName] = useState<string>("");
	const [showDebug, setShowDebug] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// GPS座標を度分秒形式に変換
	const formatGPS = (
		lat: number,
		lon: number,
		latRef: string,
		lonRef: string
	) => {
		const formatCoordinate = (coord: number, ref: string) => {
			const degrees = Math.floor(coord);
			const minutes = Math.floor((coord - degrees) * 60);
			const seconds = ((coord - degrees - minutes / 60) * 3600).toFixed(2);
			return `${degrees}°${minutes}'${seconds}"${ref}`;
		};

		return {
			latitude: formatCoordinate(lat, latRef),
			longitude: formatCoordinate(lon, lonRef),
			decimal: `${lat}, ${lon}`,
			googleMaps: `https://www.google.com/maps?q=${lat},${lon}`,
		};
	};

	// F値を読みやすい形式に変換
	const formatAperture = (value: number): string => {
		return `f/${value.toFixed(1)}`;
	};

	// シャッタースピードを読みやすい形式に変換
	const formatShutterSpeed = (value: number): string => {
		if (value >= 1) {
			return `${value.toFixed(1)}s`;
		} else {
			return `1/${Math.round(1 / value)}s`;
		}
	};

	// 露出モードの日本語変換
	const getExposureMode = (mode: number): string => {
		const modes = {
			0: "オート",
			1: "マニュアル",
			2: "オートブラケット",
			3: "オート",
		};
		return modes[mode as keyof typeof modes] || `不明 (${mode})`;
	};

	// ホワイトバランスの日本語変換
	const getWhiteBalance = (wb: number): string => {
		const wbModes = {
			0: "オート",
			1: "マニュアル",
			2: "太陽光",
			3: "蛍光灯",
			4: "白熱灯",
			5: "フラッシュ",
			6: "曇天",
			7: "日陰",
			8: "昼白色蛍光灯",
			9: "白色蛍光灯",
			10: "電球色蛍光灯",
		};
		return wbModes[wb as keyof typeof wbModes] || `不明 (${wb})`;
	};

	// 測光方式の日本語変換
	const getMeteringMode = (mode: number): string => {
		const modes = {
			0: "不明",
			1: "平均",
			2: "中央重点",
			3: "スポット",
			4: "マルチスポット",
			5: "パターン",
			6: "部分測光",
		};
		return modes[mode as keyof typeof modes] || `不明 (${mode})`;
	};

	// フラッシュ情報の日本語変換
	const getFlashInfo = (flash: number): string => {
		if (flash === 0) return "発光せず";
		if (flash === 1) return "発光";
		if (flash & 0x01) return "発光";
		if (flash & 0x04) return "ストロボリターン検出せず";
		if (flash & 0x06) return "ストロボリターン検出";
		if (flash & 0x10) return "強制発光";
		if (flash & 0x18) return "強制非発光";
		if (flash & 0x20) return "オート";
		if (flash & 0x40) return "赤目軽減";
		return `その他 (${flash})`;
	};

	// 色空間の日本語変換
	const getColorSpace = (space: number): string => {
		const spaces = {
			1: "sRGB",
			2: "Adobe RGB",
			65535: "未定義",
		};
		return spaces[space as keyof typeof spaces] || `不明 (${space})`;
	};

	// 画像方向の日本語変換
	const getOrientation = (orientation: number): string => {
		const orientations = {
			1: "正常",
			2: "左右反転",
			3: "180度回転",
			4: "上下反転",
			5: "反時計回りに90度回転して左右反転",
			6: "時計回りに90度回転",
			7: "時計回りに90度回転して左右反転",
			8: "反時計回りに90度回転",
		};
		return (
			orientations[orientation as keyof typeof orientations] ||
			`不明 (${orientation})`
		);
	};

	// 安全な値取得関数
	const safeGet = (obj: any, keys: string[]): any => {
		for (const key of keys) {
			if (obj && obj[key] !== undefined && obj[key] !== null) {
				return obj[key];
			}
		}
		return null;
	};

	// シャッター回数検索関数
	const findShutterCount = (rawExif: Record<string, any>): number | null => {
		const SHUTTER_KEYS = [
			"ShutterCount", // Nikon, Canon 一部
			"ImageCount", // Sony 一部
			"ImageNumber", // Pentax
			"TotalNumberOfShutterReleases", // Olympus
			"FileIndex", // Canon (FileIndex+DirectoryIndex の合算が回数の例も)
			"DirectoryIndex", // Canon
			"ShotInfo?.ShutterCount", // Panasonic が ShotInfo 配列に入れる例
		];

		// 直接キーマッチング
		for (const key of SHUTTER_KEYS) {
			const hit = Object.keys(rawExif).find(
				(k) => k.toLowerCase() === key.toLowerCase()
			);
			if (hit && typeof rawExif[hit] === "number" && rawExif[hit] > 0) {
				return rawExif[hit];
			}
		}

		// MakerNote内を検索
		if (rawExif.makerNote || rawExif.MakerNote) {
			const makerNote = rawExif.makerNote || rawExif.MakerNote;
			for (const key of SHUTTER_KEYS) {
				const hit = Object.keys(makerNote).find(
					(k) => k.toLowerCase() === key.toLowerCase()
				);
				if (hit && typeof makerNote[hit] === "number" && makerNote[hit] > 0) {
					return makerNote[hit];
				}
			}
		}

		// ネストされたオブジェクトを再帰的に検索
		const searchNested = (obj: any): number | null => {
			if (typeof obj !== "object" || obj === null) return null;

			for (const [key, value] of Object.entries(obj)) {
				// キー名でマッチング
				for (const targetKey of SHUTTER_KEYS) {
					if (
						key.toLowerCase() === targetKey.toLowerCase() &&
						typeof value === "number" &&
						value > 0
					) {
						return value;
					}
				}
				// ネストされたオブジェクトを再帰検索
				if (typeof value === "object" && value !== null) {
					const nested = searchNested(value);
					if (nested !== null) return nested;
				}
			}
			return null;
		};

		return searchNested(rawExif);
	};

	// 数値フォーマット関数
	const formatNumber = (value: number): string => {
		return value.toLocaleString("ja-JP");
	};

	const processExifData = useCallback(
		(rawExif: ExifData, imageInfo: any): ProcessedExifData => {
			const processed: ProcessedExifData = {
				basic: {},
				camera: {},
				settings: {},
				gps: {},
				technical: {},
				debug: {},
			};

			console.log("Raw EXIF data:", rawExif);

			// 基本情報
			processed.basic = {
				ファイル名: imageInfo.fileName,
				ファイルサイズ: `${(imageInfo.fileSize / 1024).toFixed(2)} KB`,
				ファイル形式: imageInfo.fileType,
				画像幅: `${
					imageInfo.width ||
					safeGet(rawExif, [
						"ExifImageWidth",
						"ImageWidth",
						"PixelXDimension",
					]) ||
					"不明"
				} px`,
				画像高さ: `${
					imageInfo.height ||
					safeGet(rawExif, [
						"ExifImageHeight",
						"ImageLength",
						"PixelYDimension",
					]) ||
					"不明"
				} px`,
				アスペクト比:
					imageInfo.width && imageInfo.height
						? `${(imageInfo.width / imageInfo.height).toFixed(2)}:1`
						: "不明",
				最終更新日: imageInfo.lastModified,
			};

			// カメラ情報 - より多くのフィールドを確認
			processed.camera = {};
			const make = safeGet(rawExif, ["Make", "make", "MAKE"]);
			const model = safeGet(rawExif, ["Model", "model", "MODEL"]);
			const software = safeGet(rawExif, ["Software", "software", "SOFTWARE"]);
			const lensModel = safeGet(rawExif, [
				"LensModel",
				"LensInfo",
				"Lens",
				"lensModel",
			]);
			const orientation = safeGet(rawExif, ["Orientation", "orientation"]);

			if (make) processed.camera["メーカー"] = make;
			if (model) processed.camera["カメラ"] = model;
			if (software) processed.camera["ソフトウェア"] = software;
			if (lensModel) processed.camera["レンズ"] = lensModel;
			if (orientation)
				processed.camera["画像方向"] = getOrientation(orientation);

			// カメラ情報が取得できない場合の詳細デバッグ
			if (!make && !model) {
				processed.camera["注意"] =
					"カメラ情報が見つかりません。ファイルにEXIF情報が含まれていない可能性があります。";
			}

			// 撮影設定 - より多くのフィールドを確認
			processed.settings = {};
			const dateTime = safeGet(rawExif, [
				"DateTimeOriginal",
				"DateTime",
				"dateTime",
				"DateTimeDigitized",
			]);
			const exposureTime = safeGet(rawExif, [
				"ExposureTime",
				"exposureTime",
				"ShutterSpeedValue",
			]);
			const fNumber = safeGet(rawExif, ["FNumber", "fNumber", "ApertureValue"]);
			const iso = safeGet(rawExif, [
				"ISO",
				"ISOSpeedRatings",
				"iso",
				"PhotographicSensitivity",
			]);
			const whiteBalance = safeGet(rawExif, ["WhiteBalance", "whiteBalance"]);
			const exposureMode = safeGet(rawExif, ["ExposureMode", "exposureMode"]);
			const exposureBias = safeGet(rawExif, [
				"ExposureBiasValue",
				"ExposureCompensation",
				"exposureBiasValue",
			]);
			const meteringMode = safeGet(rawExif, ["MeteringMode", "meteringMode"]);
			const flash = safeGet(rawExif, ["Flash", "flash"]);
			const focalLength = safeGet(rawExif, ["FocalLength", "focalLength"]);
			const focalLength35 = safeGet(rawExif, [
				"FocalLengthIn35mmFormat",
				"FocalLengthIn35mmFilm",
			]);
			const colorSpace = safeGet(rawExif, ["ColorSpace", "colorSpace"]);
			const shutterCount = findShutterCount(rawExif);

			if (dateTime) {
				processed.settings["撮影日時"] =
					dateTime instanceof Date
						? dateTime.toLocaleString("ja-JP")
						: String(dateTime);
			}
			if (exposureTime)
				processed.settings["シャッタースピード (SS)"] =
					formatShutterSpeed(exposureTime);
			if (fNumber) processed.settings["F値"] = formatAperture(fNumber);
			if (iso) processed.settings["ISO感度"] = iso;
			if (whiteBalance !== null)
				processed.settings["ホワイトバランス (WB)"] =
					getWhiteBalance(whiteBalance);
			if (exposureMode !== null)
				processed.settings["露出モード"] = getExposureMode(exposureMode);
			if (exposureBias !== null)
				processed.settings["露出補正値"] = `${
					exposureBias > 0 ? "+" : ""
				}${Number(exposureBias).toFixed(1)} EV`;
			if (meteringMode !== null)
				processed.settings["測光方式"] = getMeteringMode(meteringMode);
			if (flash !== null)
				processed.settings["ストロボ/フラッシュ"] = getFlashInfo(flash);
			if (focalLength) processed.settings["焦点距離"] = `${focalLength} mm`;
			if (focalLength35)
				processed.settings["35mm換算焦点距離"] = `${focalLength35} mm`;
			if (colorSpace !== null)
				processed.settings["色空間"] = getColorSpace(colorSpace);
			// シャッター回数（撮影枚数）を追加
			processed.settings["撮影枚数"] =
				shutterCount !== null ? formatNumber(shutterCount) + " 枚" : "未記録";

			// 設定情報が取得できない場合の詳細デバッグ
			if (!exposureTime && !fNumber && !iso) {
				processed.settings["注意"] =
					"撮影設定情報が見つかりません。このファイルは編集済みまたは設定情報が削除されている可能性があります。";
			}

			// GPS情報
			const lat = safeGet(rawExif, ["latitude", "GPSLatitude"]);
			const lon = safeGet(rawExif, ["longitude", "GPSLongitude"]);
			const latRef = safeGet(rawExif, ["GPSLatitudeRef", "latitudeRef"]) || "N";
			const lonRef =
				safeGet(rawExif, ["GPSLongitudeRef", "longitudeRef"]) || "E";
			const altitude = safeGet(rawExif, ["GPSAltitude", "altitude"]);

			if (lat && lon) {
				const gpsFormatted = formatGPS(lat, lon, latRef, lonRef);
				processed.gps = {
					緯度: gpsFormatted.latitude,
					経度: gpsFormatted.longitude,
					"座標（10進数）": gpsFormatted.decimal,
					"Google Maps": gpsFormatted.googleMaps,
				};
				if (altitude) {
					processed.gps["高度"] = `${altitude} m`;
				}
			}

			// 技術情報
			processed.technical = {};
			const xResolution = safeGet(rawExif, ["XResolution", "xResolution"]);
			const yResolution = safeGet(rawExif, ["YResolution", "yResolution"]);
			const compression = safeGet(rawExif, ["Compression", "compression"]);
			const bitsPerSample = safeGet(rawExif, [
				"BitsPerSample",
				"bitsPerSample",
			]);
			const photometricInterpretation = safeGet(rawExif, [
				"PhotometricInterpretation",
				"photometricInterpretation",
			]);
			const resolutionUnit = safeGet(rawExif, [
				"ResolutionUnit",
				"resolutionUnit",
			]);

			if (xResolution)
				processed.technical["X解像度"] = `${xResolution} ${
					resolutionUnit === 2 ? "dpi" : resolutionUnit === 3 ? "dpcm" : "dpi"
				}`;
			if (yResolution)
				processed.technical["Y解像度"] = `${yResolution} ${
					resolutionUnit === 2 ? "dpi" : resolutionUnit === 3 ? "dpcm" : "dpi"
				}`;
			if (compression) processed.technical["圧縮方式"] = compression;
			if (bitsPerSample) {
				processed.technical["ビット深度"] = Array.isArray(bitsPerSample)
					? bitsPerSample.join(",") + " bit"
					: `${bitsPerSample} bit`;
			}
			if (photometricInterpretation !== null)
				processed.technical["測色解釈"] = photometricInterpretation;

			// デバッグ情報 - 生のEXIFデータの一部を表示
			processed.debug = {
				EXIFキー数: Object.keys(rawExif).length,
				主要キー: Object.keys(rawExif).slice(0, 20).join(", "),
				Makeフィールド: JSON.stringify(rawExif.Make || "なし"),
				Modelフィールド: JSON.stringify(rawExif.Model || "なし"),
				ExposureTimeフィールド: JSON.stringify(rawExif.ExposureTime || "なし"),
				FNumberフィールド: JSON.stringify(rawExif.FNumber || "なし"),
				ISOフィールド: JSON.stringify(
					rawExif.ISO || rawExif.ISOSpeedRatings || "なし"
				),
				撮影枚数検索結果: shutterCount !== null ? shutterCount : "未発見",
				ShutterCountフィールド: JSON.stringify(rawExif.ShutterCount || "なし"),
				ImageCountフィールド: JSON.stringify(rawExif.ImageCount || "なし"),
				MakerNote存在: rawExif.makerNote || rawExif.MakerNote ? "あり" : "なし",
			};

			return processed;
		},
		[]
	);

	const extractExif = async (file: File) => {
		try {
			setLoading(true);
			setError("");
			setFileName(file.name);

			// 動的にexifrのfullバージョンをインポート
			const exifr = await import("exifr") as any;

			// 画像のプレビュー用URL作成
			const url = URL.createObjectURL(file);
			setImageUrl(url);

			// 画像の基本情報取得
			const imageInfo = {
				fileName: file.name,
				fileSize: file.size,
				fileType: file.type,
				lastModified: new Date(file.lastModified).toLocaleString("ja-JP"),
				width: 0,
				height: 0,
			};

			// 画像の寸法を取得
			const img = new Image();
			await new Promise((resolve, reject) => {
				img.onload = () => {
					imageInfo.width = img.width;
					imageInfo.height = img.height;
					resolve(true);
				};
				img.onerror = reject;
				img.src = url;
			});

			// EXIF情報を抽出 - MakerNote対応の包括的な設定
			const rawExif = await exifr.parse(file, {
				// ─ 対象セグメント ─
				tiff: true, // TIFF/IFD0
				exif: true, // Exif IFD
				gps: true, // GPS IFD
				makernote: true, // MakerNote → シャッター回数などメーカー独自タグ
				icc: true, // ICC プロファイル
				iptc: true, // IPTC
				jfif: true, // JFIF
				ihdr: true, // PNG IHDR (PNG の幅・高さなど)

				// ─ 挙動設定 ─
				reviveValues: true, // Rational を数値化 / 日付を Date オブジェクト化
				sanitize: false, // 値のサニタイズを無効（そのまま取得）
				mergeOutput: true, // セグメントを 1 オブジェクトにまとめる
				silentErrors: true, // 不明タグなどは警告を出さず無視

				// !!! translateKeys / translateValues を書かない !!!
				//    → デフォルト true になり、数値キーを "Make" など英語名に翻訳してくれる
			});

			console.log("Extracted EXIF data:", rawExif);

			if (!rawExif || Object.keys(rawExif).length === 0) {
				setExifData({
					basic: imageInfo,
					camera: {
						メッセージ:
							"EXIF情報が見つかりませんでした。このファイルはEXIF情報を含んでいないか、すでに削除されています。",
					},
					settings: {},
					gps: {},
					technical: {},
					debug: { ステータス: "EXIF情報なし" },
				});
			} else {
				const processed = processExifData(rawExif, imageInfo);
				setExifData(processed);
			}

			setLoading(false);
		} catch (err) {
			console.error("EXIF extraction error:", err);
			setError(
				err instanceof Error ? err.message : "ファイルの読み込みに失敗しました"
			);
			setLoading(false);
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			extractExif(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			extractExif(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const clearData = () => {
		setExifData(null);
		setImageUrl("");
		setError("");
		setFileName("");
		setShowDebug(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl);
		}
	};

	const formatExifData = (): string => {
		if (!exifData) return "";

		let text = `EXIF情報レポート - ${fileName}\n`;
		text += "=".repeat(50) + "\n\n";

		const sections = [
			{ title: "基本情報", data: exifData.basic },
			{ title: "カメラ情報", data: exifData.camera },
			{ title: "撮影設定", data: exifData.settings },
			{ title: "GPS情報", data: exifData.gps },
			{ title: "技術情報", data: exifData.technical },
		];

		if (showDebug) {
			sections.push({ title: "デバッグ情報", data: exifData.debug });
		}

		sections.forEach((section) => {
			if (Object.keys(section.data).length > 0) {
				text += `${section.title}\n`;
				text += "-".repeat(20) + "\n";
				Object.entries(section.data).forEach(([key, value]) => {
					text += `${key}: ${value}\n`;
				});
				text += "\n";
			}
		});

		text += `生成日時: ${new Date().toLocaleString("ja-JP")}\n`;

		return text;
	};

	const renderDataSection = (title: string, data: { [key: string]: any }) => {
		if (Object.keys(data).length === 0) return null;

		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{Object.entries(data).map(([key, value]) => (
							<div
								key={key}
								className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
							>
								<span className="font-medium text-gray-700 flex-shrink-0 mr-4">
									{key}
								</span>
								<span className="text-gray-900 text-sm text-right break-all">
									{key === "Google Maps" ? (
										<a
											href={value}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline"
										>
											地図で表示
										</a>
									) : (
										value
									)}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<ToolLayout
			title="完全EXIF情報解析ツール"
			description="画像ファイルの全EXIF情報を確実に抽出・表示します"
		>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>画像ファイル選択</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div
								className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="space-y-2">
									<div className="text-4xl text-gray-400">📷</div>
									<p className="text-lg font-medium">画像をドラッグ&ドロップ</p>
									<p className="text-sm text-gray-600">
										またはクリックしてファイルを選択
									</p>
								</div>
							</div>

							<div className="flex gap-2">
								<Input
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									ref={fileInputRef}
									className="flex-1"
									style={{ display: "none" }}
								/>
								<Button
									onClick={() => fileInputRef.current?.click()}
									className="flex-1"
								>
									ファイルを選択
								</Button>
								<Button onClick={clearData} variant="outline">
									クリア
								</Button>
							</div>

							<div className="text-sm text-gray-600">
								<p>対応形式: JPEG, TIFF, RAW, HEIC, PNG など</p>
								<p>
									注意:
									このツールはブラウザ内で処理し、画像をサーバーに送信しません
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{loading && (
					<Card>
						<CardContent className="text-center py-8">
							<div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
							<p>画像のEXIF情報を詳細解析中...</p>
						</CardContent>
					</Card>
				)}

				{error && (
					<Card className="border-red-200 bg-red-50">
						<CardContent className="py-4">
							<p className="text-red-700">
								<strong>エラー:</strong> {error}
							</p>
						</CardContent>
					</Card>
				)}

				{imageUrl && (
					<Card>
						<CardHeader>
							<CardTitle>画像プレビュー</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-center">
								<img
									src={imageUrl}
									alt="プレビュー"
									className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
								/>
								<p className="text-sm text-gray-600 mt-2">{fileName}</p>
							</div>
						</CardContent>
					</Card>
				)}

				{exifData && (
					<>
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-bold">完全EXIF情報詳細</h2>
							<div className="flex gap-2">
								<Button
									onClick={() => setShowDebug(!showDebug)}
									variant="outline"
									size="sm"
								>
									{showDebug ? "デバッグ非表示" : "デバッグ表示"}
								</Button>
								<CopyButton text={formatExifData()} />
							</div>
						</div>

						<Tabs defaultValue="basic" className="w-full">
							<TabsList
								className={`grid w-full ${
									showDebug ? "grid-cols-6" : "grid-cols-5"
								}`}
							>
								<TabsTrigger value="basic">基本情報</TabsTrigger>
								<TabsTrigger value="camera">カメラ</TabsTrigger>
								<TabsTrigger value="settings">設定情報</TabsTrigger>
								<TabsTrigger value="gps">GPS</TabsTrigger>
								<TabsTrigger value="technical">技術情報</TabsTrigger>
								{showDebug && <TabsTrigger value="debug">デバッグ</TabsTrigger>}
							</TabsList>

							<TabsContent value="basic" className="mt-4">
								{renderDataSection("基本情報", exifData.basic)}
							</TabsContent>

							<TabsContent value="camera" className="mt-4">
								{Object.keys(exifData.camera).length > 0 ? (
									renderDataSection("カメラ情報", exifData.camera)
								) : (
									<Card>
										<CardContent className="text-center py-8 text-gray-500">
											カメラ情報が含まれていません
										</CardContent>
									</Card>
								)}
							</TabsContent>

							<TabsContent value="settings" className="mt-4">
								{Object.keys(exifData.settings).length > 0 ? (
									renderDataSection("撮影設定", exifData.settings)
								) : (
									<Card>
										<CardContent className="text-center py-8 text-gray-500">
											撮影設定情報が含まれていません
										</CardContent>
									</Card>
								)}
							</TabsContent>

							<TabsContent value="gps" className="mt-4">
								{Object.keys(exifData.gps).length > 0 ? (
									renderDataSection("GPS位置情報", exifData.gps)
								) : (
									<Card>
										<CardContent className="text-center py-8 text-gray-500">
											GPS情報は含まれていません
										</CardContent>
									</Card>
								)}
							</TabsContent>

							<TabsContent value="technical" className="mt-4">
								{Object.keys(exifData.technical).length > 0 ? (
									renderDataSection("技術情報", exifData.technical)
								) : (
									<Card>
										<CardContent className="text-center py-8 text-gray-500">
											技術情報が含まれていません
										</CardContent>
									</Card>
								)}
							</TabsContent>

							{showDebug && (
								<TabsContent value="debug" className="mt-4">
									{renderDataSection("デバッグ情報", exifData.debug)}
								</TabsContent>
							)}
						</Tabs>
					</>
				)}

				<Card>
					<CardHeader>
						<CardTitle>完全EXIF情報解析ツールについて</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 text-sm text-gray-600">
							<div>
								<h4 className="font-semibold mb-2">本ツールの特徴</h4>
								<ul className="list-disc list-inside space-y-1">
									<li>
										<strong>完全解析</strong>:
										最適化されたexifrライブラリ設定による確実なEXIF情報抽出
									</li>
									<li>
										<strong>包括的対応</strong>:
										メーカー、カメラ、画像方向、ソフトウェア、撮影日時、設定情報（SS、F値、ISO、WB、露出モード、補正値、測光方式、ストロボ、焦点距離、色空間、撮影枚数/シャッター回数、GPS）を完全網羅
									</li>
									<li>
										<strong>デバッグ機能</strong>:
										情報が取得できない原因を特定するデバッグ表示機能
									</li>
									<li>
										<strong>多重チェック</strong>:
										複数のフィールド名パターンで確実にデータを取得
									</li>
									<li>
										<strong>MakerNote対応</strong>:
										メーカー固有情報(シャッター回数等)の抽出に対応
									</li>
									<li>
										<strong>エラー詳細</strong>:
										情報が見つからない理由を明確に表示
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-2">確実に表示される情報</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<strong>基本情報:</strong>
										<ul className="list-disc list-inside ml-4 space-y-1">
											<li>ファイル名、サイズ、形式</li>
											<li>画像寸法、アスペクト比</li>
											<li>更新日時</li>
										</ul>
									</div>
									<div>
										<strong>カメラ情報:</strong>
										<ul className="list-disc list-inside ml-4 space-y-1">
											<li>メーカー、カメラ機種</li>
											<li>レンズ情報</li>
											<li>ソフトウェア、画像方向</li>
										</ul>
									</div>
									<div>
										<strong>撮影設定:</strong>
										<ul className="list-disc list-inside ml-4 space-y-1">
											<li>撮影日時</li>
											<li>シャッタースピード (SS)、F値</li>
											<li>ISO感度、ホワイトバランス (WB)</li>
											<li>露出モード、露出補正値</li>
											<li>測光方式、ストロボ/フラッシュ</li>
											<li>焦点距離、色空間</li>
											<li>撮影枚数 (シャッター回数)</li>
										</ul>
									</div>
									<div>
										<strong>GPS・技術情報:</strong>
										<ul className="list-disc list-inside ml-4 space-y-1">
											<li>GPS座標、高度</li>
											<li>解像度、圧縮方式</li>
											<li>ビット深度、測色解釈</li>
										</ul>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-semibold mb-2">トラブルシューティング</h4>
								<ul className="list-disc list-inside space-y-1">
									<li>
										情報が表示されない場合は「デバッグ表示」ボタンを押して詳細を確認
									</li>
									<li>カメラ情報がない場合、ファイルが編集済みの可能性</li>
									<li>
										設定情報がない場合、SNSアップロード時にEXIFが削除された可能性
									</li>
									<li>
										撮影枚数が「未記録」の場合、メーカー固有タグ未対応または情報が削除されている
									</li>
									<li>
										一部メーカー（富士フイルム
										X系など）は仕様上シャッター回数が記録されない
									</li>
									<li>スクリーンショットや加工画像にはEXIF情報がありません</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-2">プライバシーと安全性</h4>
								<ul className="list-disc list-inside space-y-1">
									<li>すべての処理はブラウザ内で実行されます</li>
									<li>画像やEXIF情報はサーバーに送信されません</li>
									<li>
										GPS情報が含まれる場合は位置が特定される可能性があります
									</li>
									<li>SNS投稿前にはEXIF情報の削除を推奨します</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</ToolLayout>
	);
}

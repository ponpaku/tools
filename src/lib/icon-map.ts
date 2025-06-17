// 統一されたアイコンマッピング
// tools-config.tsで定義されているアイコン名を絵文字にマッピング

// カテゴリアイコンのマッピング
export const categoryIconMap: Record<string, string> = {
  Type: '📝',
  Lock: '🔒',
  Image: '🖼️',
  Calendar: '📅',
  Code: '💻',
  Sparkles: '✨',
  Gamepad2: '🎮',
  Calculator: '🧮',
  DollarSign: '💰',
  Network: '🌐',
  Wrench: '🔧',
  Settings: '⚙️'
}

// ツールアイコンのマッピング
export const toolIconMap: Record<string, string> = {
  Activity: '🏃',
  AlignLeft: '📝',
  ArrowLeftRight: '↔️',
  ArrowUpDown: '↕️',
  Binary: '🔢',
  Bookmark: '🔖',
  Braces: '{}',
  Calculator: '🧮',
  Calendar: '📅',
  CalendarDays: '📆',
  CaseSensitive: 'Aa',
  CircleDot: '⭕',
  Clock: '⏰',
  Clock4: '🕐',
  Code: '💻',
  CreditCard: '💳',
  Dices: '🎲',
  DollarSign: '💰',
  Eye: '👁️',
  FileCode: '📄',
  FileCode2: '📋',
  FileSearch: '🔍',
  FileText: '📄',
  Fingerprint: '🔐',
  Gamepad2: '🎮',
  GitCompare: '🔍',
  Grid3X3: '🔲',
  HardDrive: '💾',
  Hash: '#️⃣',
  Heart: '❤️',
  Highlighter: '🖍️',
  Image: '🖼️',
  Key: '🔑',
  Languages: '🈯',
  Link: '🔗',
  List: '📋',
  Lock: '🔒',
  MapPin: '📍',
  Maximize2: '🔍',
  Minimize2: '🗜️',
  Network: '🌐',
  Palette: '🎨',
  Percent: '💯',
  QrCode: '📱',
  RefreshCw: '🔄',
  RotateCcw: '↩️',
  ScanLine: '📖',
  Search: '🔍',
  Shield: '🛡️',
  ShoppingCart: '🛒',
  Smile: '😀',
  Sparkles: '✨',
  Spellcheck: '✔️',
  Star: '⭐',
  Table: '📊',
  TestTube: '🧪',
  Timer: '⏱️',
  TrendingUp: '📈',
  Trophy: '🏆',
  Type: '📝',
  Weight: '⚖️',
  Wifi: '📶',
  Wrench: '🔧',
  Zap: '⚡'
}

// アイコンを取得するヘルパー関数
export const getCategoryIcon = (iconName: string): string => {
  return categoryIconMap[iconName] || '🔧'
}

export const getToolIcon = (iconName: string): string => {
  return toolIconMap[iconName] || '🔧'
}
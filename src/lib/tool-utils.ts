import { toolsConfig } from './tools-config'

/**
 * ツールのタイトルからIDを取得する関数
 * @param title ツールのタイトル
 * @returns ツールのID、見つからない場合は空文字
 */
export function getToolIdByTitle(title: string): string {
  for (const category of toolsConfig.categories) {
    const tool = category.tools.find(tool => tool.name === title)
    if (tool) {
      return tool.id
    }
  }
  return ''
}

/**
 * パスからツールIDを抽出する関数
 * @param path ツールのパス（例: "/tools/character-counter"）
 * @returns ツールのID、見つからない場合は空文字
 */
export function getToolIdFromPath(path: string): string {
  const match = path.match(/\/tools\/([^/]+)/)
  return match ? match[1] : ''
}
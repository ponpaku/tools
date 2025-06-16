'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout';
import { Languages, ArrowRight } from 'lucide-react';

type ConversionMode = 'kana-to-romaji' | 'romaji-to-kana';
type RomajiStyle = 'hepburn' | 'kunrei' | 'nihon';

interface ConversionOptions {
  mode: ConversionMode;
  style: RomajiStyle;
  capitalizeFirst: boolean;
}

export default function KanaRomajiConverter() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ConversionOptions>({
    mode: 'kana-to-romaji',
    style: 'hepburn',
    capitalizeFirst: false
  });

  const kanaToRomajiMap: Record<string, Record<RomajiStyle, string>> = {
    'あ': { hepburn: 'a', kunrei: 'a', nihon: 'a' },
    'い': { hepburn: 'i', kunrei: 'i', nihon: 'i' },
    'う': { hepburn: 'u', kunrei: 'u', nihon: 'u' },
    'え': { hepburn: 'e', kunrei: 'e', nihon: 'e' },
    'お': { hepburn: 'o', kunrei: 'o', nihon: 'o' },
    'か': { hepburn: 'ka', kunrei: 'ka', nihon: 'ka' },
    'き': { hepburn: 'ki', kunrei: 'ki', nihon: 'ki' },
    'く': { hepburn: 'ku', kunrei: 'ku', nihon: 'ku' },
    'け': { hepburn: 'ke', kunrei: 'ke', nihon: 'ke' },
    'こ': { hepburn: 'ko', kunrei: 'ko', nihon: 'ko' },
    'が': { hepburn: 'ga', kunrei: 'ga', nihon: 'ga' },
    'ぎ': { hepburn: 'gi', kunrei: 'gi', nihon: 'gi' },
    'ぐ': { hepburn: 'gu', kunrei: 'gu', nihon: 'gu' },
    'げ': { hepburn: 'ge', kunrei: 'ge', nihon: 'ge' },
    'ご': { hepburn: 'go', kunrei: 'go', nihon: 'go' },
    'さ': { hepburn: 'sa', kunrei: 'sa', nihon: 'sa' },
    'し': { hepburn: 'shi', kunrei: 'si', nihon: 'si' },
    'す': { hepburn: 'su', kunrei: 'su', nihon: 'su' },
    'せ': { hepburn: 'se', kunrei: 'se', nihon: 'se' },
    'そ': { hepburn: 'so', kunrei: 'so', nihon: 'so' },
    'ざ': { hepburn: 'za', kunrei: 'za', nihon: 'za' },
    'じ': { hepburn: 'ji', kunrei: 'zi', nihon: 'zi' },
    'ず': { hepburn: 'zu', kunrei: 'zu', nihon: 'zu' },
    'ぜ': { hepburn: 'ze', kunrei: 'ze', nihon: 'ze' },
    'ぞ': { hepburn: 'zo', kunrei: 'zo', nihon: 'zo' },
    'た': { hepburn: 'ta', kunrei: 'ta', nihon: 'ta' },
    'ち': { hepburn: 'chi', kunrei: 'ti', nihon: 'ti' },
    'つ': { hepburn: 'tsu', kunrei: 'tu', nihon: 'tu' },
    'て': { hepburn: 'te', kunrei: 'te', nihon: 'te' },
    'と': { hepburn: 'to', kunrei: 'to', nihon: 'to' },
    'だ': { hepburn: 'da', kunrei: 'da', nihon: 'da' },
    'ぢ': { hepburn: 'ji', kunrei: 'di', nihon: 'di' },
    'づ': { hepburn: 'zu', kunrei: 'du', nihon: 'du' },
    'で': { hepburn: 'de', kunrei: 'de', nihon: 'de' },
    'ど': { hepburn: 'do', kunrei: 'do', nihon: 'do' },
    'な': { hepburn: 'na', kunrei: 'na', nihon: 'na' },
    'に': { hepburn: 'ni', kunrei: 'ni', nihon: 'ni' },
    'ぬ': { hepburn: 'nu', kunrei: 'nu', nihon: 'nu' },
    'ね': { hepburn: 'ne', kunrei: 'ne', nihon: 'ne' },
    'の': { hepburn: 'no', kunrei: 'no', nihon: 'no' },
    'は': { hepburn: 'ha', kunrei: 'ha', nihon: 'ha' },
    'ひ': { hepburn: 'hi', kunrei: 'hi', nihon: 'hi' },
    'ふ': { hepburn: 'fu', kunrei: 'hu', nihon: 'hu' },
    'へ': { hepburn: 'he', kunrei: 'he', nihon: 'he' },
    'ほ': { hepburn: 'ho', kunrei: 'ho', nihon: 'ho' },
    'ば': { hepburn: 'ba', kunrei: 'ba', nihon: 'ba' },
    'び': { hepburn: 'bi', kunrei: 'bi', nihon: 'bi' },
    'ぶ': { hepburn: 'bu', kunrei: 'bu', nihon: 'bu' },
    'べ': { hepburn: 'be', kunrei: 'be', nihon: 'be' },
    'ぼ': { hepburn: 'bo', kunrei: 'bo', nihon: 'bo' },
    'ぱ': { hepburn: 'pa', kunrei: 'pa', nihon: 'pa' },
    'ぴ': { hepburn: 'pi', kunrei: 'pi', nihon: 'pi' },
    'ぷ': { hepburn: 'pu', kunrei: 'pu', nihon: 'pu' },
    'ぺ': { hepburn: 'pe', kunrei: 'pe', nihon: 'pe' },
    'ぽ': { hepburn: 'po', kunrei: 'po', nihon: 'po' },
    'ま': { hepburn: 'ma', kunrei: 'ma', nihon: 'ma' },
    'み': { hepburn: 'mi', kunrei: 'mi', nihon: 'mi' },
    'む': { hepburn: 'mu', kunrei: 'mu', nihon: 'mu' },
    'め': { hepburn: 'me', kunrei: 'me', nihon: 'me' },
    'も': { hepburn: 'mo', kunrei: 'mo', nihon: 'mo' },
    'や': { hepburn: 'ya', kunrei: 'ya', nihon: 'ya' },
    'ゆ': { hepburn: 'yu', kunrei: 'yu', nihon: 'yu' },
    'よ': { hepburn: 'yo', kunrei: 'yo', nihon: 'yo' },
    'ら': { hepburn: 'ra', kunrei: 'ra', nihon: 'ra' },
    'り': { hepburn: 'ri', kunrei: 'ri', nihon: 'ri' },
    'る': { hepburn: 'ru', kunrei: 'ru', nihon: 'ru' },
    'れ': { hepburn: 're', kunrei: 're', nihon: 're' },
    'ろ': { hepburn: 'ro', kunrei: 'ro', nihon: 'ro' },
    'わ': { hepburn: 'wa', kunrei: 'wa', nihon: 'wa' },
    'ゐ': { hepburn: 'wi', kunrei: 'wi', nihon: 'wi' },
    'ゑ': { hepburn: 'we', kunrei: 'we', nihon: 'we' },
    'を': { hepburn: 'wo', kunrei: 'wo', nihon: 'wo' },
    'ん': { hepburn: 'n', kunrei: 'n', nihon: 'n' },
    'ー': { hepburn: '-', kunrei: '-', nihon: '-' },
    'っ': { hepburn: '', kunrei: '', nihon: '' },
    'ア': { hepburn: 'a', kunrei: 'a', nihon: 'a' },
    'イ': { hepburn: 'i', kunrei: 'i', nihon: 'i' },
    'ウ': { hepburn: 'u', kunrei: 'u', nihon: 'u' },
    'エ': { hepburn: 'e', kunrei: 'e', nihon: 'e' },
    'オ': { hepburn: 'o', kunrei: 'o', nihon: 'o' },
    'カ': { hepburn: 'ka', kunrei: 'ka', nihon: 'ka' },
    'キ': { hepburn: 'ki', kunrei: 'ki', nihon: 'ki' },
    'ク': { hepburn: 'ku', kunrei: 'ku', nihon: 'ku' },
    'ケ': { hepburn: 'ke', kunrei: 'ke', nihon: 'ke' },
    'コ': { hepburn: 'ko', kunrei: 'ko', nihon: 'ko' },
    'ガ': { hepburn: 'ga', kunrei: 'ga', nihon: 'ga' },
    'ギ': { hepburn: 'gi', kunrei: 'gi', nihon: 'gi' },
    'グ': { hepburn: 'gu', kunrei: 'gu', nihon: 'gu' },
    'ゲ': { hepburn: 'ge', kunrei: 'ge', nihon: 'ge' },
    'ゴ': { hepburn: 'go', kunrei: 'go', nihon: 'go' },
    'サ': { hepburn: 'sa', kunrei: 'sa', nihon: 'sa' },
    'シ': { hepburn: 'shi', kunrei: 'si', nihon: 'si' },
    'ス': { hepburn: 'su', kunrei: 'su', nihon: 'su' },
    'セ': { hepburn: 'se', kunrei: 'se', nihon: 'se' },
    'ソ': { hepburn: 'so', kunrei: 'so', nihon: 'so' },
    'ザ': { hepburn: 'za', kunrei: 'za', nihon: 'za' },
    'ジ': { hepburn: 'ji', kunrei: 'zi', nihon: 'zi' },
    'ズ': { hepburn: 'zu', kunrei: 'zu', nihon: 'zu' },
    'ゼ': { hepburn: 'ze', kunrei: 'ze', nihon: 'ze' },
    'ゾ': { hepburn: 'zo', kunrei: 'zo', nihon: 'zo' },
    'タ': { hepburn: 'ta', kunrei: 'ta', nihon: 'ta' },
    'チ': { hepburn: 'chi', kunrei: 'ti', nihon: 'ti' },
    'ツ': { hepburn: 'tsu', kunrei: 'tu', nihon: 'tu' },
    'テ': { hepburn: 'te', kunrei: 'te', nihon: 'te' },
    'ト': { hepburn: 'to', kunrei: 'to', nihon: 'to' },
    'ダ': { hepburn: 'da', kunrei: 'da', nihon: 'da' },
    'ヂ': { hepburn: 'ji', kunrei: 'di', nihon: 'di' },
    'ヅ': { hepburn: 'zu', kunrei: 'du', nihon: 'du' },
    'デ': { hepburn: 'de', kunrei: 'de', nihon: 'de' },
    'ド': { hepburn: 'do', kunrei: 'do', nihon: 'do' },
    'ナ': { hepburn: 'na', kunrei: 'na', nihon: 'na' },
    'ニ': { hepburn: 'ni', kunrei: 'ni', nihon: 'ni' },
    'ヌ': { hepburn: 'nu', kunrei: 'nu', nihon: 'nu' },
    'ネ': { hepburn: 'ne', kunrei: 'ne', nihon: 'ne' },
    'ノ': { hepburn: 'no', kunrei: 'no', nihon: 'no' },
    'ハ': { hepburn: 'ha', kunrei: 'ha', nihon: 'ha' },
    'ヒ': { hepburn: 'hi', kunrei: 'hi', nihon: 'hi' },
    'フ': { hepburn: 'fu', kunrei: 'hu', nihon: 'hu' },
    'ヘ': { hepburn: 'he', kunrei: 'he', nihon: 'he' },
    'ホ': { hepburn: 'ho', kunrei: 'ho', nihon: 'ho' },
    'バ': { hepburn: 'ba', kunrei: 'ba', nihon: 'ba' },
    'ビ': { hepburn: 'bi', kunrei: 'bi', nihon: 'bi' },
    'ブ': { hepburn: 'bu', kunrei: 'bu', nihon: 'bu' },
    'ベ': { hepburn: 'be', kunrei: 'be', nihon: 'be' },
    'ボ': { hepburn: 'bo', kunrei: 'bo', nihon: 'bo' },
    'パ': { hepburn: 'pa', kunrei: 'pa', nihon: 'pa' },
    'ピ': { hepburn: 'pi', kunrei: 'pi', nihon: 'pi' },
    'プ': { hepburn: 'pu', kunrei: 'pu', nihon: 'pu' },
    'ペ': { hepburn: 'pe', kunrei: 'pe', nihon: 'pe' },
    'ポ': { hepburn: 'po', kunrei: 'po', nihon: 'po' },
    'マ': { hepburn: 'ma', kunrei: 'ma', nihon: 'ma' },
    'ミ': { hepburn: 'mi', kunrei: 'mi', nihon: 'mi' },
    'ム': { hepburn: 'mu', kunrei: 'mu', nihon: 'mu' },
    'メ': { hepburn: 'me', kunrei: 'me', nihon: 'me' },
    'モ': { hepburn: 'mo', kunrei: 'mo', nihon: 'mo' },
    'ヤ': { hepburn: 'ya', kunrei: 'ya', nihon: 'ya' },
    'ユ': { hepburn: 'yu', kunrei: 'yu', nihon: 'yu' },
    'ヨ': { hepburn: 'yo', kunrei: 'yo', nihon: 'yo' },
    'ラ': { hepburn: 'ra', kunrei: 'ra', nihon: 'ra' },
    'リ': { hepburn: 'ri', kunrei: 'ri', nihon: 'ri' },
    'ル': { hepburn: 'ru', kunrei: 'ru', nihon: 'ru' },
    'レ': { hepburn: 're', kunrei: 're', nihon: 're' },
    'ロ': { hepburn: 'ro', kunrei: 'ro', nihon: 'ro' },
    'ワ': { hepburn: 'wa', kunrei: 'wa', nihon: 'wa' },
    'ヰ': { hepburn: 'wi', kunrei: 'wi', nihon: 'wi' },
    'ヱ': { hepburn: 'we', kunrei: 'we', nihon: 'we' },
    'ヲ': { hepburn: 'wo', kunrei: 'wo', nihon: 'wo' },
    'ン': { hepburn: 'n', kunrei: 'n', nihon: 'n' },
    'ッ': { hepburn: '', kunrei: '', nihon: '' }
  };

  const convertKanaToRomaji = (text: string, style: RomajiStyle): string => {
    // Digraphs with small ゃ/ゅ/ょ/ゎ etc.
    const digraphMap: Record<string, Record<RomajiStyle, string>> = {
      // k
      "きゃ": { hepburn: "kya", kunrei: "kya", nihon: "kya" },
      "きゅ": { hepburn: "kyu", kunrei: "kyu", nihon: "kyu" },
      "きょ": { hepburn: "kyo", kunrei: "kyo", nihon: "kyo" },
      // g
      "ぎゃ": { hepburn: "gya", kunrei: "gya", nihon: "gya" },
      "ぎゅ": { hepburn: "gyu", kunrei: "gyu", nihon: "gyu" },
      "ぎょ": { hepburn: "gyo", kunrei: "gyo", nihon: "gyo" },
      // s / z
      "しゃ": { hepburn: "sha", kunrei: "sya", nihon: "sya" },
      "しゅ": { hepburn: "shu", kunrei: "syu", nihon: "syu" },
      "しょ": { hepburn: "sho", kunrei: "syo", nihon: "syo" },
      "じゃ": { hepburn: "ja", kunrei: "zya", nihon: "zya" },
      "じゅ": { hepburn: "ju", kunrei: "zyu", nihon: "zyu" },
      "じょ": { hepburn: "jo", kunrei: "zyo", nihon: "zyo" },
      // t / d
      "ちゃ": { hepburn: "cha", kunrei: "tya", nihon: "tya" },
      "ちゅ": { hepburn: "chu", kunrei: "tyu", nihon: "tyu" },
      "ちょ": { hepburn: "cho", kunrei: "tyo", nihon: "tyo" },
      "ぢゃ": { hepburn: "ja", kunrei: "dya", nihon: "dya" },
      "ぢゅ": { hepburn: "ju", kunrei: "dyu", nihon: "dyu" },
      "ぢょ": { hepburn: "jo", kunrei: "dyo", nihon: "dyo" },
      // n
      "にゃ": { hepburn: "nya", kunrei: "nya", nihon: "nya" },
      "にゅ": { hepburn: "nyu", kunrei: "nyu", nihon: "nyu" },
      "にょ": { hepburn: "nyo", kunrei: "nyo", nihon: "nyo" },
      // h / b / p
      "ひゃ": { hepburn: "hya", kunrei: "hya", nihon: "hya" },
      "ひゅ": { hepburn: "hyu", kunrei: "hyu", nihon: "hyu" },
      "ひょ": { hepburn: "hyo", kunrei: "hyo", nihon: "hyo" },
      "びゃ": { hepburn: "bya", kunrei: "bya", nihon: "bya" },
      "びゅ": { hepburn: "byu", kunrei: "byu", nihon: "byu" },
      "びょ": { hepburn: "byo", kunrei: "byo", nihon: "byo" },
      "ぴゃ": { hepburn: "pya", kunrei: "pya", nihon: "pya" },
      "ぴゅ": { hepburn: "pyu", kunrei: "pyu", nihon: "pyu" },
      "ぴょ": { hepburn: "pyo", kunrei: "pyo", nihon: "pyo" },
      // m
      "みゃ": { hepburn: "mya", kunrei: "mya", nihon: "mya" },
      "みゅ": { hepburn: "myu", kunrei: "myu", nihon: "myu" },
      "みょ": { hepburn: "myo", kunrei: "myo", nihon: "myo" },
      // r
      "りゃ": { hepburn: "rya", kunrei: "rya", nihon: "rya" },
      "りゅ": { hepburn: "ryu", kunrei: "ryu", nihon: "ryu" },
      "りょ": { hepburn: "ryo", kunrei: "ryo", nihon: "ryo" },
      // f (foreign loanwords)
      "ふぁ": { hepburn: "fa", kunrei: "ha", nihon: "ha" },
      "ふぃ": { hepburn: "fi", kunrei: "hi", nihon: "hi" },
      "ふぇ": { hepburn: "fe", kunrei: "he", nihon: "he" },
      "ふぉ": { hepburn: "fo", kunrei: "ho", nihon: "ho" },
      "ふゅ": { hepburn: "fyu", kunrei: "hyu", nihon: "hyu" },
      // v (voiced loanwords)
      "ゔぁ": { hepburn: "va", kunrei: "va", nihon: "va" },
      "ゔぃ": { hepburn: "vi", kunrei: "vi", nihon: "vi" },
      "ゔ": { hepburn: "vu", kunrei: "vu", nihon: "vu" },
      "ゔぇ": { hepburn: "ve", kunrei: "ve", nihon: "ve" },
      "ゔぉ": { hepburn: "vo", kunrei: "vo", nihon: "vo" },
      // Katakana equivalents
      "キャ": { hepburn: "kya", kunrei: "kya", nihon: "kya" },
      "キュ": { hepburn: "kyu", kunrei: "kyu", nihon: "kyu" },
      "キョ": { hepburn: "kyo", kunrei: "kyo", nihon: "kyo" },
      "ギャ": { hepburn: "gya", kunrei: "gya", nihon: "gya" },
      "ギュ": { hepburn: "gyu", kunrei: "gyu", nihon: "gyu" },
      "ギョ": { hepburn: "gyo", kunrei: "gyo", nihon: "gyo" },
      "シャ": { hepburn: "sha", kunrei: "sya", nihon: "sya" },
      "シュ": { hepburn: "shu", kunrei: "syu", nihon: "syu" },
      "ショ": { hepburn: "sho", kunrei: "syo", nihon: "syo" },
      "ジャ": { hepburn: "ja", kunrei: "zya", nihon: "zya" },
      "ジュ": { hepburn: "ju", kunrei: "zyu", nihon: "zyu" },
      "ジョ": { hepburn: "jo", kunrei: "zyo", nihon: "zyo" },
      "チャ": { hepburn: "cha", kunrei: "tya", nihon: "tya" },
      "チュ": { hepburn: "chu", kunrei: "tyu", nihon: "tyu" },
      "チョ": { hepburn: "cho", kunrei: "tyo", nihon: "tyo" },
      "ニャ": { hepburn: "nya", kunrei: "nya", nihon: "nya" },
      "ニュ": { hepburn: "nyu", kunrei: "nyu", nihon: "nyu" },
      "ニョ": { hepburn: "nyo", kunrei: "nyo", nihon: "nyo" },
      "ヒャ": { hepburn: "hya", kunrei: "hya", nihon: "hya" },
      "ヒュ": { hepburn: "hyu", kunrei: "hyu", nihon: "hyu" },
      "ヒョ": { hepburn: "hyo", kunrei: "hyo", nihon: "hyo" },
      "ビャ": { hepburn: "bya", kunrei: "bya", nihon: "bya" },
      "ビュ": { hepburn: "byu", kunrei: "byu", nihon: "byu" },
      "ビョ": { hepburn: "byo", kunrei: "byo", nihon: "byo" },
      "ピャ": { hepburn: "pya", kunrei: "pya", nihon: "pya" },
      "ピュ": { hepburn: "pyu", kunrei: "pyu", nihon: "pyu" },
      "ピョ": { hepburn: "pyo", kunrei: "pyo", nihon: "pyo" },
      "ミャ": { hepburn: "mya", kunrei: "mya", nihon: "mya" },
      "ミュ": { hepburn: "myu", kunrei: "myu", nihon: "myu" },
      "ミョ": { hepburn: "myo", kunrei: "myo", nihon: "myo" },
      "リャ": { hepburn: "rya", kunrei: "rya", nihon: "rya" },
      "リュ": { hepburn: "ryu", kunrei: "ryu", nihon: "ryu" },
      "リョ": { hepburn: "ryo", kunrei: "ryo", nihon: "ryo" },
      "ファ": { hepburn: "fa", kunrei: "ha", nihon: "ha" },
      "フィ": { hepburn: "fi", kunrei: "hi", nihon: "hi" },
      "フェ": { hepburn: "fe", kunrei: "he", nihon: "he" },
      "フォ": { hepburn: "fo", kunrei: "ho", nihon: "ho" },
      "フュ": { hepburn: "fyu", kunrei: "hyu", nihon: "hyu" },
      "ヴァ": { hepburn: "va", kunrei: "va", nihon: "va" },
      "ヴィ": { hepburn: "vi", kunrei: "vi", nihon: "vi" },
      "ヴ": { hepburn: "vu", kunrei: "vu", nihon: "vu" },
      "ヴェ": { hepburn: "ve", kunrei: "ve", nihon: "ve" },
      "ヴォ": { hepburn: "vo", kunrei: "vo", nihon: "vo" },
    };

    let result = '';
    let i = 0;
    
    while (i < text.length) {
      let matched = false;
      
      // Check for digraphs first (2 characters)
      if (i + 1 < text.length) {
        const digraph = text.slice(i, i + 2);
        if (digraphMap[digraph]) {
          result += digraphMap[digraph][style];
          i += 2;
          matched = true;
        }
      }
      
      if (!matched) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === 'っ' || char === 'ッ') {
          if (nextChar && kanaToRomajiMap[nextChar]) {
            const nextRomaji = kanaToRomajiMap[nextChar][style];
            if (nextRomaji) {
              result += nextRomaji[0];
            }
          }
        } else if (kanaToRomajiMap[char]) {
          result += kanaToRomajiMap[char][style];
        } else {
          result += char;
        }
        
        i++;
      }
    }
    
    return result;
  };

  const convertRomajiToKana = (text: string): string => {
    const romajiToKanaMap: Record<string, string> = {
      // Basic vowels
      'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
      // Basic consonants
      'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
      'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
      'sa': 'さ', 'shi': 'し', 'si': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
      'za': 'ざ', 'ji': 'じ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
      'ta': 'た', 'chi': 'ち', 'ti': 'ち', 'tsu': 'つ', 'tu': 'つ', 'te': 'て', 'to': 'と',
      'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
      'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
      'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'hu': 'ふ', 'he': 'へ', 'ho': 'ほ',
      'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
      'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
      'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
      'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
      'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
      'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を',
      'n': 'ん',
      // Digraphs
      'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
      'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
      'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
      'sya': 'しゃ', 'syu': 'しゅ', 'syo': 'しょ',
      'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
      'zya': 'じゃ', 'zyu': 'じゅ', 'zyo': 'じょ',
      'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
      'tya': 'ちゃ', 'tyu': 'ちゅ', 'tyo': 'ちょ',
      'dya': 'ぢゃ', 'dyu': 'ぢゅ', 'dyo': 'ぢょ',
      'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
      'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
      'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
      'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
      'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
      'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
      // Foreign sounds
      'fa': 'ふぁ', 'fi': 'ふぃ', 'fe': 'ふぇ', 'fo': 'ふぉ', 'fyu': 'ふゅ',
      'va': 'ゔぁ', 'vi': 'ゔぃ', 'vu': 'ゔ', 've': 'ゔぇ', 'vo': 'ゔぉ'
    };

    let result = '';
    let i = 0;
    
    while (i < text.length) {
      let matched = false;
      
      // Check for longer matches first (up to 4 characters for "cha", "sha", etc.)
      for (let len = 4; len >= 1; len--) {
        const substr = text.slice(i, i + len).toLowerCase();
        if (romajiToKanaMap[substr]) {
          result += romajiToKanaMap[substr];
          i += len;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        result += text[i];
        i++;
      }
    }
    
    return result;
  };

  const convertedText = useMemo(() => {
    if (!input.trim()) return '';
    
    let result = '';
    
    if (options.mode === 'kana-to-romaji') {
      result = convertKanaToRomaji(input, options.style);
      
      if (options.capitalizeFirst) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
      }
    } else {
      result = convertRomajiToKana(input);
    }
    
    return result;
  }, [input, options]);

  const handleClear = () => {
    setInput('');
  };

  const handleSwapMode = () => {
    setOptions(prev => ({
      ...prev,
      mode: prev.mode === 'kana-to-romaji' ? 'romaji-to-kana' : 'kana-to-romaji'
    }));
    setInput(convertedText);
  };

  return (
    <ToolLayout
      title="かな・ローマ字変換"
      description="ひらがな・カタカナとローマ字の相互変換ツール"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label htmlFor="conversion-mode">変換モード</Label>
                  <Select
                    value={options.mode}
                    onValueChange={(value: ConversionMode) => 
                      setOptions(prev => ({ ...prev, mode: value }))
                    }
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kana-to-romaji">かな → ローマ字</SelectItem>
                      <SelectItem value="romaji-to-kana">ローマ字 → かな</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapMode}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  入れ替え
                </Button>
              </div>

              {options.mode === 'kana-to-romaji' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="romaji-style">ローマ字方式</Label>
                    <Select
                      value={options.style}
                      onValueChange={(value: RomajiStyle) => 
                        setOptions(prev => ({ ...prev, style: value }))
                      }
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hepburn">ヘボン式</SelectItem>
                        <SelectItem value="kunrei">訓令式</SelectItem>
                        <SelectItem value="nihon">日本式</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capitalize-first"
                      checked={options.capitalizeFirst}
                      onCheckedChange={(checked) =>
                        setOptions(prev => ({ ...prev, capitalizeFirst: !!checked }))
                      }
                    />
                    <Label htmlFor="capitalize-first">先頭文字を大文字化</Label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="input">
                    {options.mode === 'kana-to-romaji' ? 'かな文字入力' : 'ローマ字入力'}
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    クリア
                  </Button>
                </div>
                <Textarea
                  id="input"
                  placeholder={
                    options.mode === 'kana-to-romaji' 
                      ? 'ひらがな・カタカナを入力してください'
                      : 'ローマ字を入力してください'
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    {options.mode === 'kana-to-romaji' ? 'ローマ字出力' : 'かな文字出力'}
                  </Label>
                  <CopyButton text={convertedText} />
                </div>
                <Textarea
                  value={convertedText}
                  readOnly
                  className="min-h-[200px] font-mono bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">使い方</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>変換モード：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>かな → ローマ字：</strong>ひらがな・カタカナをローマ字に変換</li>
                  <li><strong>ローマ字 → かな：</strong>ローマ字をひらがなに変換</li>
                </ul>
                
                <p className="pt-2"><strong>ローマ字方式：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>ヘボン式：</strong>shi, chi, tsu, fu, ji, zu など</li>
                  <li><strong>訓令式：</strong>si, ti, tu, hu, zi, zu など</li>
                  <li><strong>日本式：</strong>si, ti, tu, hu, di, du など</li>
                </ul>
                
                <p className="pt-2"><strong>オプション：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>先頭文字を大文字化：</strong>変換結果の最初の文字を大文字にします</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
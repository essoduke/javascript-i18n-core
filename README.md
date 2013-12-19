# javascript-i18n-core

easy way to perform i18n in your javascript project.

## Installation

```html
...
<head>
<script type="text/javascript" src="i18n.js"></script>
</head>
...
```

## Configure
```javascript
i18n.set({
  'lang': 'ISO639-1, ISO3166-1 language code', //e.g. en-us, zh-tw. Default auto detect from browser.
  'path': 'language file\'s path' // Default is empty (same level as i18n.js)
});
```

## Language file 
### File contents format
```json
{
    "setting": {
        "DST": 8,
        "format": "Y 年 m 月 d 日 (l) H:i:s",
        "AM": "上午",
        "PM": "下午"
    },
    "shortMonths": ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"],
    "longMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    "shortDays": ["日", "一", "二", "三", "四", "五", "六"],
    "longDays": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],

    //your text
    "Hello %1, Nice to meet you": "你好 %1, 很高興認識你",
    "My name is %1, I\'m %2 years old": "我的名字是 %1, 我今年 %2 歲"
}
```
### Filename
Filename must be same as language code. e.g. `zh-tw.js`, `zh-cn.js`...

## License
javascript-i18n-core was release under [MIT License](http://opensource.org/licenses/MIT)

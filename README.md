# javascript-i18n-core

Easy way to perform Internationalization(i18n) and localization in your javascript project.

Live Demo: http://app.essoduke.org/i18n

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
  'lang': '"ISO639-1-ISO3166-1" language code', //e.g. en-us, zh-tw. Default is auto detect from browser.
  'path': 'language file\'s path' // Default is empty (same level as i18n.js)
});
```
## Usage
```javascript

var s = i18n._('LANGUAGE ID');
var s = i18n.datetime();
var s = i18n.datetime('Date time');

```
## Language file 
### File contents in JSON format
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

    "Hello World": "世界您好！",
    "Hello %1, Nice to meet you": "你好 %1, 很高興認識你",
    "My name is %1, I\'m %2 years old": "我的名字是 %1, 我今年 %2 歲"
}
```
### Filename rule
Filename must be same as language code. e.g. `zh-tw.js`, `zh-cn.js`...

## Examples
### String
```javascript
// Use above JSON content.

// String without variables. 
i18n._('Hellow World'); 
// return 您好世界！

// String with variables.
i18n._('Hello %1, Nice to meet you', 'John'); 
// return 你好 John, 很高興認識你

i18n._('My name is %1, I\'m %2 years old', 'Mary', 15); 
// return 我的名字是 Mary, 我今年 15 歲
```
### Date time
```javascript
i18n.datetime(); 
// return Current datetime

i18n.datetime('2011/01/01 08:15:23');
// return '2011 年 01 月 01 日 08:15:23' datetime format.
```
## License
javascript-i18n-core was release under [MIT License](http://opensource.org/licenses/MIT).

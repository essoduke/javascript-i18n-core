# Javascript-i18n-core

Simply i18n solution for javascript

Demo: https://code.essoduke.org/i18n

## Quick start
```javascript
import I18N from '/path/i18n.es6.js';
const i18n = new I18N({
    'locale': '/path/language.json'
});

let value = i18n._('key');
```

## Language file in JSON format
```json
{
    "__meta__": {
        "datetime": "Y 年 m 月 d 日 (l) H:i:s",
        "timezone": 8
    },
    "hello_world": "世界您好！",
    "hi_there": "你好 {1}, 很高興認識你",
    "self_intro": "我的名字是 {1}, 我今年 {2} 歲",
    "key1": {
        "_": "Key self",
        "key_1_1": "...",
        "key_1_2": {
            "key_1_2_1": "MY KEY"
        }
    }
}
```

## Example
### get string
```javascript
let str = i18n._('key1'); // output: "Key Self"
let str = i18n._('key1.key_1_2.key_1_2_1'); // output: "MY KEY"
```
### change locale
```javascript
// By file path
i18n.locale('/path/language.json');
```

### Date time
```javascript
// return Current datetime in defined format.
i18n.datetime(); 
// OR ovderide format
i18n.datetime(FORMAT_STRING);

```
## License
javascript-i18n-core was release under [MIT License](http://opensource.org/licenses/MIT).

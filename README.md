# Javascript-i18n-core
Simple i18n solution for javascript.

Documentation: https://code.essoduke.org/i18n

## Quick start
```javascript
import i18n from '/path/i18n.es6.js';

i18n.set({
    "resource": "/path/language.json",
    "locale": "en"
}).init(function () {
    // Do something.
    // this._("string key");
});
```
## Usage
```javascript
let foo = i18n._("string key");

// use "." for multiple level
let foo = i18n._("anime.japan"); // output "Japanese Douga"
let foo = i18n._("anime.japan.attact_on_titan"); // output "Attact On Titan"

// Variables
// By object
const conan = {
    "year": 2022,
    "num": 99
};
let foo = i18n._("anime.japan.detective conan", conan); // output "2022 Vol.99"

// By arguments
let foo = i18n._("anime.japan.detective conan", 2022, 99); // output "2022 Vol.99"
```

### Change language
```javascript
// Change default language
console.log(i18n.set('locale', 'jp')._("string key"));
console.log(i18n._("string key"));
// Get specific language
console.log(i18n._("en", "string key"));
console.log(i18n._("string key"))

// Output:
// 1.string in Japanese
// 2.string in Japanese
// 3.string in English
// 4.string in Japanese
```
### Auto translate
```html
<div data-i18n="string key">...</div>
```
```javascript
// Initialize
i18n.set(...).init(function () {
    i18n.translate();
});

// Event trigger
button.addEventListener("click", function () {
    // auto translate in default language
    i18n.translate()
    
    // auto translate in specific language 
    // it won't change the default language setting
    i18n.translate('jp');
    
    // after auto translate, still output in "default language"
    i18n._("string key"); // output in "English"
});
```

## Language file example
```javascript
{
    "en": { // Language key"
        // Example {"key": "value"}
        "hello": "Hello world!",
        "intro": "Hi, My name is {name}. I'm {age} years-old.",
        "keyN": {
            "keyN1": {
                "KeyN1A": "..."
            }
        }
    },
    "tw": {
        "hello": "哈囉，世界！",
        "intro": "嗨！我的名字是 {name}。我今年 {age} 歲。",
        "keyN": {
            "keyN1": {
                "KeyN1A": "..."
            }
        }
    }
    "others": {
        ...
    }
    ...
}
```

## License
javascript-i18n-core was release under [MIT License](http://opensource.org/licenses/MIT).

# design-het-widget

Interactive web widget for Design Week 2019 - Budapest


## Demo

http://brigittaforrai.com/design-het-widget/

## Install

```
npm install design-het-widget --save
```

## Import widget

Import widget into **index.html** or use javascript import
```html
	<head>
		<script src="node_modules/design-het-widget/dist/design-het-widget.min.js"></script>
	</head>
```
```javascript
	import 'node_modules/design-het-widget/dist/design-het-widget.min.js'
```
Add components
``` html
	<body>
	    <design-het music-url="music.mp3" style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
	    <design-het-interface></design-het-interface>
	</body>
```

## Attributes

### design-het:
#### music-url:
```html
	<design-het music-url="music.mp3"></design-het>
```
#### circles:
- Number of bigger circle groups
- Fallback value: 1
- Max value: 3
```html
	<design-het circles="3" ></design-het>
```

### design-het-interface:
#### disable-download:
- default: false
```html
	<design-het-interface disable-download="true"></design-het-interface>
```

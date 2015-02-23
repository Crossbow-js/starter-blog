
Crossbow is not just *another* static site generator. We have unique features that 
make it so much better than your current workflow, you won't quite beleive how you 
lived without it.

### Code highlighting.

Simply put this in your markdown file:

    ```js
    
    var crossbow = "Best Static Site Generator on the planet";
    
    ```
    
... and this is what you'll end up with (look, no funny syntax literring your markdown files)


```js
var crossbow = "Best Static Site Generator on the planet";
```

---

### File Includes

Use the `\{{inc}}` helper for doing file includes

```hbs
\{{inc src="button.html"}}
```
{{inc src="button.html"}}
Crossbow can create truly beautiful markup. Just view source on this page, you'll see exactly
what we mean!

```hbs
<main>
    <div class="container">
        \{{inc src="someinclude.html"}}
    </div>
</main>
```

... turns into:  
```hbs
<main>
    <div class="container">
        <p>Look, Indentation is preserved</p>
    </div>
</main>
```
### Universal JS Boilerplate

---

<!-- [![NPM](https://nodei.co/npm/universal-js-boilerplate.png)](https://nodei.co/npm/universal-js-boilerplate/) -->
<!-- ![](https://david-dm.org/matthiasak/universal-js-boilerplate.svg) -->

This is a scaffolding project that includes boilerplate code for:

- Node
- Heroku configuration
- Babel, Babel runtime, ES6/2015, ES7/2016
- Express, with a default server, some example code and routes, static file sharing, and proxy code
- Node-sass, some example SCSS, grids, normalize and typeplate css kits (installed from bower)
- Example files/resources
- An example .gitignore for the project
- A host of npm scripts for watching and building your files
- Documentation and testing scaffolds

#### How to get started

1. Start your own project folder with a git clone, and if you plan to push this clone to GitHub, you'll need to change your origin:

    ```sh
    cd ~/Github\ Projects/
    git clone git@github.com:matthiasak/universal-js-boilerplate.git NEWPROJECT
    cd NEWPROJECT
    git remote remove origin
    git remote add origin YOUR_SSH_ADDRESS
    ```

2. Install prerequisites

    ```sh
    npm install
    ```

3. Start your server:

    ```sh
    npm run s

    # Alternatively, if you need nodemon to auto-reload your server
    # (when doing server-side work)
    # npm run server
    ```

4. Ready to push your code live, and want to minify your code with uglifyjs?

    ```sh
    npm run build
    ```

#### Changelog

- Oct 21, 2015
    - Build system and package.json changes: Tools are now installed per project, due to difficulties in global tool/version management. Tools are also now included as a dependency (installed with `npm install`), so that build tools can run both local server or on platforms like Heroku. When you push to platforms like Heroku, the package.json will automatically build the source files and flush them into the dist folder. This eliminates the need to manage the built js and css files in Git, so they are now in `.gitignore`.
    - `npm run watch` no longer uglifies by default, and automatically builds source maps with `-d` option for browserify
    - `mocha` is configured to run with babel, so tests and files can be run with ES7/6
    - `esdoc` is automatically installed and provided with a config file to help with generating documentation for DocBlocks. Install `docblockr` (Sublime Text) or similar plugins to make this easy.
    - PostCSS removed in favor of node-sass, because despite the speed benefits, no one releases anything in PostCSS, nor does PostCSS have perfect support for advanced Sass language syntax like mixins and interpolation.
    - React has been upgraded to v0.14

#### License

MIT.

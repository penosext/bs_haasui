#添加TypeScript,Vue3支持
先创建一个miniapp项目在这个miniapp项目根目录运行此命令

```bash
cnpm install typescript
   sed -i "s/commonjs(),/commonjs(),require('@rollup\/plugin-typescript')(),/g" ./node_modules/aiot-vue-cli/src/libs/rollup.config.js
   sed -i "s/compiler.parseComponent(content, { pad: 'line' })/compiler.parse(content, { pad: 'line' }).descriptor/g" ./node_modules/aiot-vue-cli/web-loaders/falcon-vue-loader/lib/parser.js
   sed -i "s/path.resolve(__dirname, '.\/vue\/packages\/vue-template-compiler\/index.js')/'@vue\/compiler-sfc'/g" ./node_modules/aiot-vue-cli/cli-libs/index.js
   sed -i "s/compiler.parseComponent(content, { pad: true })/compiler.parse(content, { pad: true }).descriptor/g" ./node_modules/aiot-vue-cli/src/libs/parser.js
   sed -i "s/compiler.compile/compiler.compileTemplate/g" ./node_modules/aiot-vue-cli/web-loaders/falcon-vue-loader/lib/template-compiler/index.js
   sed -i "s/const replaceValues = {}/const replaceValues = { 'defineComponent': '' }/g" ./node_modules/aiot-vue-cli/src/libs/rollup.config.js
```

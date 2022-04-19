const path = require('path')
const webpack =  require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const copyWebpackPlugin = require('copy-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const dirApp = path.resolve(__dirname, 'app')
const dirShared = path.resolve(__dirname, 'shared')
const dirStyles = path.resolve(__dirname, 'styles')
const dirNodes = 'node_modules'

module.exports = {
    entry:[
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss')
    ],
    resolve:{
        modules:[
            dirApp,
            dirShared,
            dirStyles,
            dirNodes
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
            //to use this variable throughout the code
        }),
        new copyWebpackPlugin({
            patterns: [
                {
                    from:'./shared',
                    to:''
                }
            ]
            //to copy paste the files in the build folder
        }),
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename:'[id].css'
            //to copy paste the files in the build folder
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                        plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        ],
                    },
                },
          }),
    ],
    module:{
        rules:[
           {
                test:/\.js$/,
                use:{
                    loader:'babel-loader'
                }
           },
           {
                test:/\.scss$/,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader
                    },
                    {
                        loader:'css-loader',
                        //for including css files in js files
                    },
                    {
                        loader:'postcss-loader',
                         //for adding cross browser compatibility of css poperty
                    },
                    {
                        loader:'sass-loader',
                        //for compiling scss files to css
                    },
                ]
            },
            {
                test: /\.(png|jpe?g|svg|gif|woff2|fnt|webp)$/,
                loader: 'file-loader',
                options: { 
                    name (file) {
                        return '[hash].[ext]'
                    }
                }// for easy import of files
            },
            {
                test: /\.(png|jpe?g|svg|gif|webp)$/,
                use:[
                    {
                        loader: ImageMinimizerPlugin.loader,
                        options:{
                            severityError:'warning',
                            minimizeOptions:{
                                plugins:['gifsicle']
                            }
                        }
                    }
                ]
            },
            {
                test:/\.(glsl|frag|vert)$/,
                loader:'raw-loader',
                exclude:/node_modules/                
            },
            {
                test:/\.(glsl|frag|vert)$/,
                loader:'glslify-loader',
                exclude:/node_modules/  
            }
        ]
    }
}
import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass' 
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)

//Funcion para leer el archivo scss y compilar a css
export function css(done){
    src('src/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('build/css')) 

    done()
}

//Funcion para utilizar watch con gulp
export function dev(){
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)

}

//funcion para js
export function js(done){

    src('src/js/*.js')
        .pipe(dest('build/js')) 

    done()
}

export default series(js, css, dev)
const publicPath = 'blog';  // VuePress generated path default is 'docs'
const sortDelimiter = ';';
const glob = require('glob');
const fs = require('fs');
const yamlFront = require('yaml-front-matter');

let markdownsArray = glob.sync(publicPath + '/*/*.md');

// no sort
    // let blogPosts = glob.sync('blog/*/*.md').map(filePath => filePath.substring(publicPath.length, filePath.lastIndexOf('/')) + '/');

// sort posts by 'date' in YAML header descendantly
    let blogPosts = new Array();
    markdownsArray.forEach(filePath => {
        fileContents = fs.readFileSync(filePath, 'utf8').toString();
        fileMeta = yamlFront.loadFront(fileContents);
        blogPosts.push(fileMeta.date + sortDelimiter + filePath);
    });
    blogPosts = blogPosts.sort().reverse();
    blogPosts.forEach((sortedPath, index, array) => {
        array[index] = sortedPath.substring(sortedPath.indexOf(sortDelimiter) + sortDelimiter.length + publicPath.length, sortedPath.lastIndexOf('/')) + '/';
    });

module.exports = {
    title: 'Howar31 Blog',
    description: 'New blog, 2019',
    dest: 'public',
    themeConfig: {
        sidebarDepth: 1,
        sidebar: blogPosts,
    },
}
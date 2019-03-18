const basePath = 'blog';  // VuePress generated path default is 'docs'
const sortDelimiter = ';';
const glob = require('glob');
const fs = require('fs');
const moment = require('moment');
const yamlFront = require('yaml-front-matter');

/**
 * Generate sidebar array
 * @param {array} markdownPaths contains a array list of file paths
 * @param {bool} sort sort the output array by 'date' in YAML header descendantly or not
 */
function generateSidebar(markdownPaths, sort = true) {
    let renderedPosts = new Array();

    if (sort) {
        markdownPaths.forEach(filePath => {
            fileContents = fs.readFileSync(filePath, 'utf8').toString();
            fileMeta = yamlFront.loadFront(fileContents);
            fileTimestamp = moment(fileMeta.date);
            renderedPosts.push(fileTimestamp + sortDelimiter + filePath);
        });
        renderedPosts = renderedPosts.sort().reverse();
        renderedPosts.forEach((sortedPath, index, array) => {
            array[index] = sortedPath.substring(sortedPath.indexOf(sortDelimiter) + sortDelimiter.length + basePath.length, sortedPath.lastIndexOf('/')) + '/';
        });
    } else {
        renderedPosts = markdownPaths.map(filePath => filePath.substring(basePath.length, filePath.lastIndexOf('/')) + '/');
    }

    return renderedPosts;
}

// Generate blog post sidebar
let blogPaths = glob.sync(basePath + '/*/*.md');
let blogPosts = generateSidebar(blogPaths);

// Generate archived Wordpress post sidebar
let wordpressPaths = glob.sync(basePath + '/wordpress/*/*.md');
let wordpressPosts = generateSidebar(wordpressPaths);

module.exports = {
    title: 'Howar31 Blog',
    description: 'Web Developer from Taiwan',
    dest: 'public',
    themeConfig: {
        sidebarDepth: 1,    // extract to h2
        sidebar: [
            {
                title: 'All Posts',
                children: blogPosts
            },
            {
                title: 'Archived Posts',
                children: wordpressPosts
            },
        ],
        lastUpdated: 'Last Updated',
    },
}
/**
 * REGEX HELL
 */

Object.defineProperty(exports, '__esModule', { value: true })

const scan = {
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(\n+|$)/,
    codeBlock: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    indentCodeBlock: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    inlineCodeBlock: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    url: /^https?:\/\/[^`\n\r\n\t\f\v ]+\.(?:png|jpg|jpeg|webp|svg|mp4|gif)\b/,
    image: /^!\[(label)\]\((https?:\/\/[^`\n\r\n\t\f\v ]+\.(?:png|jpg|jpeg|webp|svg|gif))\)/,
    urlGlobal: /https?:\/\/[^`\n\r\n\t\f\v ]+\.(?:png|jpg|jpeg|webp|svg|mp4|gif)\b/g,
    imageGlobal: /!\[(label)\]\((https?:\/\/[^`\n\r\n\t\f\v ]+\.(?:png|jpg|jpeg|webp|svg|gif))\)/g,
}

/**
 * """Tokenize""" the passed string and extract media links, and also do
 * some other manipulations with the string & return it.
 * @param {String} src
 * @param {any} headings
 * @returns {Array<String | Array<String>>}
 */
function formatString(src, headings) {
    headings = headings || {}
    /**
     * @type {Array<String>}
     */
    let mediaLinks = []
    let formattedString = ''
    /**
     * @type {RegExpMatchArray}
     */
    let match
    while (src) {
        // Ignore code blocks and inline codespan when extracting urls
        if ((match = src.match(scan.codeBlock))) {
            formattedString += src.substring(0, match[0].length)
            src = src.substring(match[0].length)
            continue
        }

        if ((match = src.match(scan.indentCodeBlock))) {
            formattedString += src.substring(0, match[0].length)
            src = src.substring(match[0].length)
            continue
        }

        if ((match = src.match(scan.inlineCodeBlock))) {
            formattedString += src.substring(0, match[0].length)
            src = src.substring(match[0].length)
            continue
        }

        if ((match = src.match(scan.heading))) {
            formattedString += `**${headings[match[2].trim()] ||
                match[2].trim()}**${match[3]}`
            src = src.substring(match[0].length)
            // Extract from header, idk why someone would do this but w/e
            if ((match = src.match(scan.urlGlobal))) {
                mediaLinks.push(
                    match[0].endsWith('svg')
                        ? `https://util.bruhmomentlol.repl.co/svg?q=${match[0]}`
                        : match[0],
                )
                formattedString += src.substring(0, match[0].length)
                src = src.substring(match[0].length)
                continue
            }

            if ((match = src.match(scan.imageGlobal))) {
                mediaLinks.push(
                    match[1].endsWith('svg')
                        ? `https://util.bruhmomentlol.repl.co/svg?q=${match[1]}`
                        : match[1],
                )
                formattedString += src.substring(0, match[0].length)
                src = src.substring(match[0].length)
                continue
            }
            continue
        }

        if ((match = src.match(scan.url))) {
            mediaLinks.push(
                match[0].endsWith('svg')
                    ? `https://util.bruhmomentlol.repl.co/svg?q=${match[0]}`
                    : match[0],
            )
            formattedString += src.substring(0, match[0].length)
            src = src.substring(match[0].length)
            continue
        }

        if ((match = src.match(scan.image))) {
            mediaLinks.push(
                match[1].endsWith('svg')
                    ? `https://util.bruhmomentlol.repl.co/svg?q=${match[1]}`
                    : match[1],
            )
            formattedString += src.substring(0, match[0].length)
            src = src.substring(match[0].length)
            continue
        }

        formattedString += src.substring(0, 1)
        src = src.substring(1)
    }
    return [formattedString, mediaLinks]
}

exports.formatString = formatString

export const imageURLCombiner = url => {
    if (!url) return null

    if(url.startsWith("https://")) return url
    else return 'https://' + url
}
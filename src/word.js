
function word(_, querystr) {

    function buildgraph(body) {

    }

    function addword(graph, word) {

    }

    function main() {
        util.setcss('word')
        const body = util.clearbody()
        const query = util.parseuri(querystr)
        const words = query.words
        const graph = buildgraph(body)

        if (words instanceof Array)
            addword(body, word)

    }


    return main()
}


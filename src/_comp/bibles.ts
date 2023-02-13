
/* Not including:
    * Translations that don't at least have the NT
    * Unpopular translations that score less than 4
*/
const bibles_raw = {
    esv: {
        abbrev: "ESV",
        name: "English Standard Version",
        year: 2001,
        type: "Literal",
        source: "Alexandrian",
        info: 'https://www.esv.org/',
        license: 'https://www.crossway.org/permissions/',
        read: 'https://www.bible.com/bible/59/JHN.1.ESV',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: false,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    niv: {
        abbrev: "NIV",
        name: "New International Version",
        year: 1978,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://www.biblica.com/niv-bible/',
        license: 'https://www.biblica.com/permissions/',
        read: 'https://www.bible.com/bible/111/JHN.1.NIV',
        credit: "© Biblica, Inc.",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: true,
        },
    },
    nlt: {
        abbrev: "NLT",
        name: "New Living Translation",
        year: 1996,
        type: "Very dynamic",
        source: "Alexandrian",
        info: 'https://www.tyndale.com/nlt/',
        license: 'https://www.tyndale.com/permissions',
        read: 'https://www.bible.com/bible/116/JHN.1.NLT',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    net: {
        abbrev: "NET",
        name: "New English Translation",
        year: 1996,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://netbible.com/',
        license: 'https://netbible.com/copyright/',
        read: 'https://www.bible.com/bible/107/JHN.1.NET',
        credit: "© Biblical Studies Press, L.L.C.",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: true,  // License is equivelent to CC BY-NC-ND
        },
    },
    web: {
        abbrev: "WEB",
        name: "World English Bible",
        year: 2000,
        type: "Literal",
        source: "Byzantine",
        info: 'https://worldenglish.bible/',
        license: 'https://worldenglish.bible/',
        read: 'https://www.bible.com/bible/206/JHN.1.WEBUS',
        credit: "Public domain",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: true,
            use_quote_openly: true,
            use_commercially: true,
            audio: true,
            translate: true,
            modify: true,
            owner_supportive: true,
        },
    },
    nkjv: {
        abbrev: "NKJV",
        name: "New King James Version",
        year: 1982,
        type: "Literal",
        source: "Byzantine",
        info: 'https://www.thomasnelsonbibles.com/nkjv-bible/',
        license: 'https://www.harpercollinschristian.com/sales-and-rights/permissions/#1',
        read: 'https://www.bible.com/bible/114/JHN.1.NKJV',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    csb: {
        abbrev: "CSB",
        name: "Christian Standard Bible",
        year: 2017,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://csbible.com/',
        license: 'https://csbible.com/about-the-csb/faqs/#faq/may-i-use-the-christian-standard-bible-in-my-writing',
        read: 'https://www.bible.com/bible/1713/JHN.1.CSB',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 1000,
            quote_ratio: 50,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    nasb: {
        abbrev: "NASB",
        name: "New American Standard Bible",
        year: 1960,
        type: "Very literal",
        source: "Alexandrian",
        info: 'https://www.lockman.org/new-american-standard-bible-nasb/',
        license: 'https://www.lockman.org/permission-to-quote-copyright-trademark-information/',
        read: 'https://www.bible.com/bible/2692/JHN.1.NASB2020',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 1000,
            quote_ratio: 50,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    lsv: {
        abbrev: "LSV",
        name: "Literal Standard Version",
        year: 2020,
        type: "Very literal",
        source: "Byzantine",
        info: 'https://www.lsvbible.com/',
        license: 'https://creativecommons.org/licenses/by-sa/4.0/',
        read: 'https://eng.global.bible/bible/01b29f4b342acc35-01/JHN.1',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: true,
            audio: true,
            translate: true,
            modify: true,
            owner_supportive: true,
        },
    },
    leb: {
        abbrev: "LEB",
        name: "Lexham English Bible",
        year: 2012,
        type: "Very literal",
        source: "Alexandrian",
        info: 'https://lexhampress.com/product/6162/lexham-english-bible-leb-with-audio-new-testament',
        license: 'https://lexhampress.com/LEB-License',
        read: 'https://www.bible.com/bible/90/JHN.1.LEB',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: true,  // License is equivelent to CC BY-NC-ND
        },
    },
    fbv: {
        abbrev: "FBV",
        name: "Free Bible Version",
        year: 2018,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://freebibleversion.org/',
        license: 'https://freebibleversion.org/',
        read: 'https://www.bible.com/bible/1932/JHN.1.FBV',
        credit: "© Dr. Jonathan Gallagher",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: true,
            audio: true,
            translate: true,
            modify: true,
            owner_supportive: true,
        },
    },
    oeb: {
        abbrev: "OEB",
        name: "Open English Bible",
        year: 2010,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://openenglishbible.org/',
        license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        read: 'https://openenglishbible.org/oeb/2022.1/read/b043.html',
        credit: "public domain",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: true,
            quote_ratio: true,
            quote_book: true,
            not_attribute: true,
            use_quote_openly: true,
            use_commercially: true,
            audio: true,
            translate: true,
            modify: true,
            owner_supportive: true,
        },
    },
    kjv: {
        abbrev: "KJV",
        name: "King James Version",
        year: 1611,
        type: "Archaic",
        source: "Byzantine",
        info: 'https://en.wikipedia.org/wiki/King_James_Version',
        license: 'https://www.cambridge.org/bibles/about/rights-and-permissions/rights-and-permissions-kjv',
        read: 'https://www.bible.com/bible/1/JHN.1.KJV',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: true,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    nrsv: {
        abbrev: "NRSV",
        name: "New Revised Standard Version",
        year: 1989,
        type: "Dynamic",
        source: "Alexandrian",
        info: 'https://nrsvbibles.org/',
        license: 'https://nrsvbibles.org/index.php/licensing/',
        read: 'https://www.bible.com/bible/2016/JHN.1.NRSV',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 500,
            quote_ratio: 25,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
    lsb: {
        abbrev: "LSB",
        name: "Legacy Standard Bible",
        year: 2021,
        type: "Very literal",
        source: "Alexandrian",
        info: 'https://lsbible.org/',
        license: 'https://lsbible.org/permission-to-quote-the-lsb/',
        read: 'https://read.lsbible.org/',
        credit: "",
        can: {
            read_for_free: true,
            read_anonymously: false,
            quote: 1000,
            quote_ratio: 50,
            quote_book: false,
            not_attribute: false,
            use_quote_openly: true,
            use_commercially: false,
            audio: false,
            translate: false,
            modify: false,
            owner_supportive: false,
        },
    },
}


// Add extra rating props to each
export const BIBLES = Object.fromEntries(Object.entries(bibles_raw).map(([id, props]) => {
    const rating = Object.values(props.can).filter(val => val === true).length
    const rating_class = rating >= 9 ? 'good' : (rating >= 5 ? 'mixed' : 'bad')
    return [id, {id, ...props, rating, rating_class}]
}))

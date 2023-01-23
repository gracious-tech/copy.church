
const critical_texts = {
    sr: {
        abbrev: "SR",
        name: "Statistical Restoration",
        year: 2022,
        info: 'https://greekcntr.org/',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        read: 'https://github.com/Center-for-New-Testament-Restoration/SR',
        can: {
            read: true,
            distribute: true,
            translate: true,
            modify: true,
            not_attribute: false,
            use_commercially: true,
            transparent: true,
        },
    },
    na: {
        abbrev: "NA",
        name: "Novum Testamentum Graece",
        year: 2012,
        info: 'https://www.academic-bible.com/en/home/',
        license: 'https://www.academic-bible.com/en/online-bibles/novum-testamentum-graece-na-28/copyright/',
        read: 'https://www.academic-bible.com/en/online-bibles/novum-testamentum-graece-na-28/read-the-bible-text/',
        can: {
            read: true,
            distribute: false,
            translate: false,
            modify: false,
            not_attribute: false,
            use_commercially: false,
            transparent: false,
        },
    },
    ubs: {
        abbrev: "UBS",
        name: "UBS Greek New Testament",
        year: 2014,
        info: 'https://www.academic-bible.com/en/home/',
        license: 'https://www.academic-bible.com/en/online-bibles/greek-new-testament-ubs5/copyright/',
        read: 'https://www.academic-bible.com/en/online-bibles/greek-new-testament-ubs5/read-the-bible-text/',
        can: {
            read: true,
            distribute: false,
            translate: false,
            modify: false,
            not_attribute: false,
            use_commercially: false,
            transparent: false,
        },
    },
    sbl: {
        abbrev: "SBL",
        name: "SBL Greek New Testament",
        year: 2010,
        info: 'https://sblgnt.com/',
        license: 'https://www.sblgnt.com/license/',
        read: 'https://www.sblgnt.com/download/',
        can: {
            read: true,
            distribute: true,
            translate: true,
            modify: true,
            not_attribute: false,
            use_commercially: true,
            transparent: false,
        },
    },
    tyndale: {
        abbrev: "TH",
        name: "Tyndale Greek New Testament",
        year: 2017,
        info: 'https://www.thegreeknewtestament.com/',
        license: 'https://www.thegreeknewtestament.com/',
        read: 'https://www.esv.org/gnt',
        can: {
            read: true,
            distribute: false,
            translate: false,
            modify: false,
            not_attribute: false,
            use_commercially: false,
            transparent: false,
        },
    },
    byzantine: {
        abbrev: "RP",
        name: "Byzantine Textform",
        year: 2018,
        info: 'https://bibletranslation.ws/robinson-pierpont-gnt-2018-update/',
        license: 'https://archive.org/details/RP2005KoineGreekNTinByzantineTextform/page/n5/mode/2up',
        read: 'https://bibletranslation.ws/robinson-pierpont-gnt-2018-update/',
        can: {
            read: true,
            distribute: true,
            translate: true,
            modify: true,
            not_attribute: true,
            use_commercially: true,
            transparent: false,
        },
    },
}


// Add extra rating props to each
export const CRITICALS = Object.fromEntries(Object.entries(critical_texts).map(([id, props]) => {
    const rating = Object.values(props.can).filter(val => val === true).length
    const rating_class = rating >= 6 ? 'good' : (rating >= 3 ? 'mixed' : 'bad')
    return [id, {id, ...props, rating, rating_class}]
}))

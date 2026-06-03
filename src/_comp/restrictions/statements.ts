
// License presets used by the statements below
const PUBLIC_DOMAIN = {
    license: "Public domain",
    can: {
        read: true,
        distribute: true,
        translate: true,
        modify: true,
        not_attribute: true,
        use_commercially: true,
    },
}
const ND = {
    license: "No Derivatives",
    can: {
        read: true,
        distribute: true,
        translate: false,
        modify: false,
        not_attribute: false,
        use_commercially: true,
    },
}
const NC_ND = {
    license: "Non-commercial No-Derivatives",
    can: {
        read: true,
        distribute: true,
        translate: false,
        modify: false,
        not_attribute: false,
        use_commercially: false,
    },
}
const READ_ONLY = {
    license: "All rights reserved",
    can: {
        read: true,
        distribute: false,
        translate: false,
        modify: false,
        not_attribute: false,
        use_commercially: false,
    },
}


const statements_raw = {
    sunnyvale: {
        name: "Sunnyvale Statement",
        year: 2025,
        website: 'https://copy.church/statement',
        ...PUBLIC_DOMAIN,
    },
    antioch: {
        name: "Antioch Declaration",
        year: 2024,
        website: 'https://antiochdeclaration.com',
        ...ND,
    },
    csbi: {
        name: "Chicago Statement on Biblical Inerrancy",
        year: 1978,
        website: 'https://alliancenet.org/icbi/the-chicago-statement-on-biblical-inerrancy',
        ...ND,
    },
    csbh: {
        name: "Chicago Statement on Biblical Hermeneutics",
        year: 1982,
        website: 'https://alliancenet.org/icbi/the-chicago-statement-on-biblical-hermeneutics',
        ...ND,
    },
    csba: {
        name: "Chicago Statement on Biblical Application",
        year: 1986,
        website: 'https://alliancenet.org/icbi/the-chicago-statement-on-biblical-application',
        ...ND,
    },
    cambridge: {
        name: "Cambridge Declaration",
        year: 1996,
        website: 'https://alliancenet.org/about/cambridge-declaration',
        ...ND,
    },
    danvers: {
        name: "Danvers Statement",
        year: 1989,
        website: 'https://cbmw.org/about/the-danvers-statement',
        ...NC_ND,
    },
    nashville: {
        name: "Nashville Statement",
        year: 2017,
        website: 'https://cbmw.org/the-nashville-statement',
        ...READ_ONLY,
    },
    christology: {
        name: "Ligonier Statement on Christology",
        year: 2016,
        website: 'https://christologystatement.com',
        ...READ_ONLY,
    },
    dallas: {
        name: "Dallas Statement on Social Justice and the Gospel",
        year: 2018,
        website: 'https://statementonsocialjustice.com',
        ...READ_ONLY,
    },
    natural_affections: {
        name: "Statement on Natural Affections",
        year: 2024,
        website: 'https://natural-affections.com',
        ...READ_ONLY,
    },
    manhattan: {
        name: "Manhattan Declaration",
        year: 2009,
        website: 'https://manhattandeclaration.org',
        ...READ_ONLY,
    },
    cacn: {
        name: "Statement from Christians Against Christian Nationalism",
        year: 2019,
        website: 'https://christiansagainstchristiannationalism.org',
        ...READ_ONLY,
    },
    scng: {
        name: "Statement on Christian Nationalism and the Gospel",
        year: 2024,
        website: 'https://statementonchristiannationalism.com',
        ...READ_ONLY,
    },
    nar: {
        name: "NAR and Christian Nationalism Statement",
        year: 2022,
        website: 'https://narandchristiannationalism.com',
        ...READ_ONLY,
    },
    prophetic: {
        name: "Prophetic Standards Statement",
        year: 2021,
        website: 'https://propheticstandards.com',
        ...READ_ONLY,
    },
    norman: {
        name: "Norman Statement on the Abolition of Abortion",
        year: 2023,
        website: 'https://abolitionistsrising.com/norman-statement',
        ...READ_ONLY,
    },
    niagara: {
        name: "Niagara Declaration",
        year: 2020,
        website: 'https://niagaradeclaration.ca',
        ...READ_ONLY,
    },
    frankfurt: {
        name: "Frankfurt Declaration of Christian and Civil Liberties",
        year: 2022,
        website: 'https://frankfurtdeclaration.com',
        ...READ_ONLY,
    },
    sufficiency: {
        name: "Sufficiency Statement",
        year: 2024,
        website: 'https://sufficiencystatement.com',
        ...READ_ONLY,
    },
}


// Add rating props to each statement
export const STATEMENTS = Object.fromEntries(Object.entries(statements_raw).map(([id, props]) => {
    const rating = Object.values(props.can).filter(val => val === true).length
    const rating_class = rating >= 6 ? 'good' : (rating >= 3 ? 'mixed' : 'bad')
    return [id, {id, ...props, rating, rating_class}]
}))

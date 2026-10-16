
// Helpers and types shared by update_watch_data.ts and the private steps it loads
// (.private/): writing data files, owner names, license detection, and parsing
// copyright notices into their holders.

import {writeFileSync} from 'node:fs'

import type {Translation, Owner, LicenseTerms} from '../src/_data/watch/types.ts'


export const DATA_DIR = new URL('../src/_data/watch/', import.meta.url)

export const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')


// ---- small generic helpers ----

export function save_text(name:string, text:string, dir = DATA_DIR):void{
    // Write one of our own data (or cache) files as is, unless this is a dry run
    if (DRY_RUN){
        console.info(`[dry-run] would write ${name}`)
        return
    }
    writeFileSync(new URL(name, dir), text)
}

export function save_json(name:string, data:unknown, dir = DATA_DIR):void{
    // Write one of our own data (or cache) files, matching the repo's existing 4-space formatting
    save_text(name, JSON.stringify(data, null, 4) + '\n', dir)
}

export function sort_keys<T>(record:Record<string, T>):Record<string, T>{
    // Sort a cache by key before saving, so a refresh only shows real changes in the diff
    return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)))
}

// Fetch each key in `keys` into `cache` one at a time (waiting `delay_ms` before each), to go easy
// on the source — a failed fetch is left uncached, to retry next run. Returns how many failed.
export async function fetch_into<T>(cache:Record<string, T>, keys:string[],
        fetcher:(key:string) => Promise<T>, delay_ms = 0):Promise<number>{
    let failed = 0
    for (const key of keys){
        if (delay_ms)
            await new Promise(resolve => setTimeout(resolve, delay_ms))
        try {
            cache[key] = await fetcher(key)
        } catch (error){
            console.warn(`Lookup failed for ${key}: ${(error as Error).message}`)
            failed += 1
        }
    }
    return failed
}

// Legal-entity suffixes to ignore when turning an owner name into an id, so e.g. "Bridge
// Connectivity Solutions" and "Bridge Connectivity Solutions Pvt. Ltd." collapse to one owner
const ORG_SUFFIX_RE = new RegExp(String.raw`,?\s*\b(pvt\.?\s*ltd\.?|ltd\.?|llc\.?|inc\.?|corp\.?|`
    + String.raw`corporation|gmbh|plc\.?|s\.a\.?|a\.\s*c\.|e\.?\s*v\.?)\s*$`, 'i')

export function slugify(name:string):string{
    // Turn an owner display name into a stable, url-safe id — also drops a leading "The" so
    // e.g. "Bible Society of Papua New Guinea" and "The Bible Society of Papua New Guinea"
    // collapse to one owner. Keeps any Unicode letter/number (not just a-z0-9) so a non-Latin-
    // script name (e.g. Cyrillic) still gets a real, distinguishing id instead of every such name
    // collapsing to the same empty string and silently merging into one fake shared owner.
    const stripped = name.replace(ORG_SUFFIX_RE, '').replace(/^the\s+/i, '').trim()
    return stripped.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '')
}

// Each id's folded form (see fold), as worked out so far
const folded_ids = new Map<string, string>()

export function fold(id:string):string{
    // An id with the accents on its Latin letters dropped, for matching names that differ only in
    // accents ("Alliance Biblique du Benin", "Alliance Biblique du Bénin") — ids keep their accents
    let folded = folded_ids.get(id)
    if (folded === undefined){
        folded = id.normalize('NFD').replace(/(?<=\p{Script=Latin})\p{M}+/gu, '').normalize('NFC')
        folded_ids.set(id, folded)
    }
    return folded
}

export async function fetch_json<T>(url:string, headers:Record<string, string> = {}):Promise<T>{
    const res = await fetch(url, {headers})
    if (!res.ok)
        throw new Error(`Failed to fetch ${url}: ${res.status}`)
    return res.json() as Promise<T>
}

// Other names sources use for an org (short forms, typos, old names, translations), keyed by
// slug, mapped to the one name it's listed under
const ORG_ALIASES:Record<string, string> = {
    hosanna: 'Faith Comes By Hearing',
    hosanna_faith_comes_by_hearing: 'Faith Comes By Hearing',
    tyndale_house_foundation: 'Tyndale House Publishers',  // Its charitable foundation
    twftw: 'The Word for the World International',
    twftw_international: 'The Word for the World International',
    word_for_the_world: 'The Word for the World International',
    word_for_the_world_bible_translators_international: 'The Word for the World International',
    wycliffe: 'Wycliffe Bible Translators, Inc.',
    wyciiffe_bible_translators: 'Wycliffe Bible Translators, Inc.',
    wyclyffe_bible_translators: 'Wycliffe Bible Translators, Inc.',
    pioneer: 'Pioneer Bible Translators',
    pioneer_bible_tanslators: 'Pioneer Bible Translators',
    pioneer_bible_tranalators: 'Pioneer Bible Translators',
    tsco_seed_co: 'The Seed Company',
    seed_co: 'The Seed Company',
    bible_league: 'Bible League International',
    world_home_bible_league: 'Bible League International',  // Its former name
    international_bible_society: 'Biblica, Inc.',  // Its former name
    bible_society_of_australia: 'Bible Society Australia',
    honduras_bible_society_of: 'Bible Society of Honduras',
    nigerian_bible_translation_trust: 'The Nigeria Bible Translation Trust',
    gillbt: 'Ghana Institute of Linguistics, Literacy and Bible Translation',
    cabtal: 'Cameroon Association for Bible Translation and Literacy',
    sil_png: 'SIL Papua New Guinea',
    l_assoc_nationale_traduction_bible_et_l_alphabt:
        'Association Nationale pour la Traduction de la Bible et l’Alphabétisation',
    association_nationale_pour_le_traduction_de_la_bible_et_l_alphabétisation:
        'Association Nationale pour la Traduction de la Bible et l’Alphabétisation',
    coordination_inter_eglises_pour_la_traduction_et_l_alphabetisation_en_langue_gabonaise:
        'Coordination Inter-Eglises pour la Traduction et l\'alphabétisation en Langue Gabonaise',
    union_nacional_de_traductores_indigenas: 'Unión Nacional de Traductores Indígenas',
    институт_перевода_библии: 'Institute for Bible Translation, Russia',
    artist_for_israel_international: 'Artists for Israel International',
    artists_for_israel_intl: 'Artists for Israel International',
    door_43_international_mission_community: 'Door43 World Missions Community',
    gilakmedia_com: 'Gilak Media',
    wilbur_n_pickering_thm_phd: 'Wilbur N. Pickering',
    ellis_w_deibler_jr: 'Ellis W. Deibler',
    bib_sen_an: 'Ron Smith',  // His own DBL account, named after his translation
    far_east_broadcasting_company: 'Far East Broadcasting Company',
    son_light_sunshine_foundation: 'Son Light Foundation',
    world_for_the_world_international: 'The Word for the World International',
    wycliffe_bible_translator: 'Wycliffe Bible Translators, Inc.',
    wycliffe_bible_translations: 'Wycliffe Bible Translators, Inc.',
    tov_rose: 'TovRose',
    schweizerische_bibelgesellschaft: 'Swiss Bible Society',
    sociedad_bíblica_de_guatemala: 'Bible Society in Guatemala',
    sociedade_bíblica_do_brasil: 'Bible Society of Brazil',
    traducteurs_pionniers_de_la_bible: 'Pioneer Bible Translators',
    gillbt_ghana_institute_of_linguistics_literacy_and_bible_translation:
        'Ghana Institute of Linguistics, Literacy and Bible Translation',
    nectar: 'North East Centre for Training and Research',
    bukavu_archdiocese_of_bukavu: 'Archdiocese of Bukavu',
    библийым_кусарыше_институт_ий: 'Institute for Bible Translation, Finland',
    ethnos_360: 'Ethnos360',
    new_tribes_mission: 'Ethnos360',  // Its former name
    missão_novos_tribos_do_brasil: 'Missão Novas Tribos do Brasil',
    sil_international: 'SIL Global',  // Its former name
    sil_usa: 'SIL Global',
    wycliffe_usa: 'Wycliffe Bible Translators, Inc.',
    wycliffe_bible_tarnslators: 'Wycliffe Bible Translators, Inc.',
    wycliffe_indian: 'Wycliffe India',
    davar_partners_international: 'Davar Audio Bibles',  // Its former name
    davar_partners: 'Davar Audio Bibles',
    bridge_connectivity_systems: 'Bridge Connectivity Solutions',
    friends_study_bible: 'Friends Bible Study',
    partners_development_foundation: 'Partners in Development Foundation',
    institute_for_bible_translation_moscow: 'Institute for Bible Translation, Russia',
    institute_for_bible_translation_helsinki: 'Institute for Bible Translation, Finland',
    raamatunkäännösinstituutti_ry: 'Institute for Bible Translation, Finland',
    united_bible_society: 'United Bible Societies',
    // Other forms of a Bible Society's name ("in" or "of", word order, typos), for the one DBL
    // lists it under
    bible_society_in_botswana: 'The Bible Society of Botswana',
    bible_socitety_botswana: 'The Bible Society of Botswana',
    bible_society_of_cambodia: 'Bible Society in Cambodia',
    bible_society_in_cote_d_ivoire: 'Bible Society of Côte d\'Ivoire',
    bible_society_of_france: 'French Bible Society',
    bible_society_of_gabon: 'Bible Society in Gabon',
    bible_society_of_guatemala: 'Bible Society in Guatemala',
    bible_society_of_indonesia: 'Indonesian Bible Society',
    indonesia_bible_society: 'Indonesian Bible Society',
    bible_society_in_new_zealand: 'Bible Society New Zealand Charitable Trust',
    bible_society_of_pakistan: 'Pakistan Bible Society',
    philippine_bible_society: 'Philippines Bible Society',
    bible_society_of_the_republic_of_congo: 'Bible Society of Congo (Republic)',
    bible_society_in_the_republic_of_belarus: 'Bible Society of Belarus (the Republic of)',
    bible_society_of_russia: 'Bible Society in Russia',
    bible_soceity_in_senegal: 'Bible Society in Senegal',
    bible_society_in_the_seychelles: 'Seychelles Bible Society',
    bible_society_of_sierra_leone: 'Bible Society in Sierra Leone',
    bible_society_in_the_south_pacific: 'Bible Society of the South Pacific',
    bible_society_of_suriname: 'Suriname Bible Society',
    thai_bible_society: 'Thailand Bible Society',
    mongolian_united_bible_society: 'Mongolian Union Bible Society',
    sharif_bible_society: 'International Sharif Bible Society',
    // Names with "&" in them, which would otherwise be split into two holders
    cambridge_university_press_assessment: 'Cambridge University Press',  // Its current name
    bible_society_of_singapore_malaysia_brunei: 'Bible Society of Singapore, Malaysia and Brunei',
    // Bible Societies' own names in their language, for the English name DBL lists them under
    deutsche_bibelgesellschaft: 'German Bible Society',
    det_danske_bibelselskab: 'Danish Bible Society',
    det_norske_bibelselskap: 'Norwegian Bible Society',
    nederlands_bijbelgenootschap: 'Netherlands Bible Society',
    suomen_pipliaseura: 'Finnish Bible Society',
    genfer_bibelgesellschaft: 'Bible Society of Geneva',
    sociedades_bíblicas_unidas: 'United Bible Societies',
    alliance_biblique_universelle: 'United Bible Societies',
    sociedad_bíblica_argentina: 'Argentine Bible Society',
    sociedad_bíblica_colombiana: 'Colombian Bible Society',
    sociedad_bíblica_paraguaya: 'Paraguayan Bible Society',
    alliance_biblique_du_congo: 'Bible Society of Congo (Republic)',
    українське_біблійне_товариство: 'Ukrainian Bible Society',
    surinaams_bijbelgenootschap: 'Suriname Bible Society',
    føroyska_bíbliufelagið: 'Faroese Bible Society',
    british_and_foreign_bible_society: 'British & Foreign Bible Society',
    мукаддес_китап_терҗиме_институты: 'Institute for Bible Translation, Russia',
    alliance_biblique_au_burkina_faso: 'Bible Society of Burkina Faso',
    alliance_biblique_au_burkina_fasoburkina_faso: 'Bible Society of Burkina Faso',
    alliance_biblique_de_burkina_faso: 'Bible Society of Burkina Faso',
    alliance_biblique_du_burkina_faso: 'Bible Society of Burkina Faso',
    alliance_biblique_du_bénin: 'Bible Society of Benin',
    l_alliance_biblique_du_bénin: 'Bible Society of Benin',
    alliance_biblique_du_cameroun: 'Bible Society of Cameroon',
    alliance_biblique_en_centrafrique: 'Bible Society in the Central African Republic',
    la_société_biblique_de_centrafrique: 'Bible Society in the Central African Republic',
    alliance_biblique_de_côte_d_ivoire: 'Bible Society of Côte d\'Ivoire',
    alliance_bibleque_de_côte_d_ivoire: 'Bible Society of Côte d\'Ivoire',
    alliance_biblique_de_la_république_démocratique_du_congo:
        'Bible Society of the Democratic Republic of Congo',
    l_alliance_biblique_de_la_république_démocratique_du_congo:
        'Bible Society of the Democratic Republic of Congo',
    société_biblique_de_la_république_démocratique_du_congo:
        'Bible Society of the Democratic Republic of Congo',
    société_biblique_de_la_r_d_congo: 'Bible Society of the Democratic Republic of Congo',
    société_biblique_de_la_r_c_congo: 'Bible Society of the Democratic Republic of Congo',
    // Its name when the country was Zaïre
    kinshasa_la_société_biblique_du_zaïre: 'Bible Society of the Democratic Republic of Congo',
    alliance_biblique_au_mali: 'Bible Society of Mali',
    l_alliance_biblique_au_mali: 'Bible Society of Mali',
    alliance_biblique_au_tchad: 'Bible Society of Chad',
    alliance_biblique_du_tchad: 'Bible Society of Chad',
    l_alliance_biblique_du_tchad: 'Bible Society of Chad',
    société_biblique_du_tchad: 'Bible Society of Chad',
    alliance_biblique_du_togo: 'Bible Society of Togo',
    l_alliance_biblique_du_togo: 'Bible Society of Togo',
    société_biblique_française: 'French Bible Society',
    société_biblique_française_bibli_o: 'French Bible Society',  // Bibli'O is its publisher
    société_biblique_haïtienne: 'Haitian Bible Society',
    la_société_biblique_malgache: 'Malagasy Bible Society',
    sociedad_bíblica_de_argentina: 'Argentine Bible Society',
    sociedade_bíblica_em_angola: 'Bible Society in Angola',
    sociedad_bíblica_ecuatoriana: 'United Bible Societies in Ecuador',
    sociedad_bíblica_de_españa: 'Bible Society of Spain',
    sociedad_bíblica_de_honduras: 'Bible Society of Honduras',
    sociedad_bíblica_boliviana: 'Bolivian Bible Society',
    sociedad_bíblica_chilena: 'Chilean Bible Society',
    sociedad_bíblica_de_costa_rica: 'Bible Society of Costa Rica',
    sociedad_bíblica_guatemala: 'Bible Society in Guatemala',
    sociedad_bíblica_de_méxico: 'Bible Society of Mexico',
    sociedad_bíblica_de_nicaragua: 'Bible Society in Nicaragua',
    sociedad_bíblica_peruana: 'Peruvian Bible Society',
    la_sociedad_bíblica_peruana: 'Peruvian Bible Society',
    sociedade_bíblica_de_moçambique: 'Bible Society of Mozambique',
    sociedadebíblica_de_moçambique: 'Bible Society of Mozambique',
    sociedade_bíblica_de_portugal: 'Bible Society of Portugal',
    lembaga_alkitab_indonesia: 'Indonesian Bible Society',
    lai: 'Indonesian Bible Society',
    nederlands_vlaams_bijbelgenootschap: 'Netherlands Bible Society',
    stichting_surinaams_bijbelgenootschap: 'Suriname Bible Society',
    sosiedat_di_beibel: 'Bible Society in Netherlands Antilles and Aruba',
    suomen_pipliaseura_fintiko_pipliako_staggos: 'Finnish Bible Society',
    towarzystwo_biblijne_w_polsce: 'Bible Society in Poland',
    biblijsko_društvo_srbije: 'Bible Society of Serbia',
    библијско_друштво_србијe: 'Bible Society of Serbia',
    библиско_здружение_на_р_македонија: 'Bible Society of the Republic of Macedonia',
    българско_библейско_дружество: 'Bulgarian Bible Society',
    российское_библейское_общество: 'Bible Society in Russia',
    台灣聖經公會: 'Bible Society in Taiwan',
    香港圣经公会: 'Hong Kong Bible Society',
    baebol_sosieti_saot_pasific_i_copiraetem_baebol_ya_long: 'Bible Society of the South Pacific',
    // Joint notices in other languages ("X et les Y"), where the other holder is credited anyway
    traducteurs_pionniers_de_la_bible_et_alliance_biblique_en_guinée: 'Pioneer Bible Translators',
    mission_evangélique_reformée_néerlandaise_et_les_traducteurs_pionniers_de_la_bible:
        'Mission Evangélique Réformée Néerlandaise',
    // Notices in other languages that a parse left a word of prose on ("made by", "of the")
    yenziwe_yibiblica: 'Biblica, Inc.',
    von_de_kjennichs_bibel_jesalschoft: 'Kjennichs-Bibel Jesalschoft',
    // Names given with a location or description
    ethnos360_sanford_florida: 'Ethnos360',
    new_tribes_missionsanford_fl_1_usa: 'Ethnos360',
    missão_novas_tribos_sanford_fl: 'Missão Novas Tribos do Brasil',
    sil_international_publisher: 'SIL Global',
    institute_for_bible_translation_stockholm_sweden: 'Institute for Bible Translation, Sweden',
    lembaga_alkitab_indonesia_jakarta: 'Indonesian Bible Society',
    towarzystwo_biblijne_w_polsce_warszawa: 'Bible Society in Poland',
    bible_translation_and_literacy_east_africa: 'Bible Translation and Literacy',
    royal_jongbloed_heerenveen_the_netherlands: 'Jongbloed Uitgeverij',
    katholieke_bijbelstichting_breda: 'Katholieke Bijbelstichting',
    katholieke_bijbelstichting_hoeven: 'Katholieke Bijbelstichting',
    crossway_bibles_a_publishing_ministry_of_good_news_publishers: 'Crossway',
    crossway_a_publishing_ministry_of_good_news_publishers: 'Crossway',
    crossway_good_news_publishers: 'Crossway',
    theologischer_verlag_zürich: 'TVZ Theologischer Verlag Zürich AG',
    bibe_translation_and_literacy: 'Bible Translation and Literacy',
    // Acronyms and short or translated forms of names listed elsewhere
    itdal: 'Initiative for the Translation and Development of African Languages',
    bspng: 'Bible Society of Papua New Guinea',
    mern: 'Mission Evangélique Réformée Néerlandaise',
    acotba: 'Association Congolaise de Traductions de la Bible',
    acotba_subo: 'Association Congolaise de Traductions de la Bible',
    ubs: 'United Bible Societies',
    nbtt: 'The Nigeria Bible Translation Trust',
    kartidaya: 'Yayasan Kartidaya Sahabat Indonesia',
    uitgeverij_skandalon: 'Skandalon',  // "Skandalon Publishing"
    kitabı_mukaddes_şirketi: 'Bible Society in Turkey',
    sociedades_bíblicas_unidas_en_venezuela: 'United Bible Societies in Venezuela',
    በbiblica: 'Biblica, Inc.',  // Amharic "by"
    la_liga_bíblica: 'Bible League International',
    liga_bíblica: 'Bible League International',
    liga_bíblica_mundial_del_hogar: 'Bible League International',  // World Home Bible League
    liga_bíblica_internacional: 'Bible League International',
    royal_jongbloed: 'Jongbloed Uitgeverij',
    edições_vida_nova: 'Sociedade Religiosa Edições Vida Nova',
    ahirani_christi_iswari_mandli_sakri_dhule:
        'Ahirani Christi Iswari Mandli, Sakri, Dhule, Maharashtra',
    nahali_vishwaseen_mandli_toranmal_nandurbar:
        'Nahali Vishwaseen Mandli, Toranmal, Dhadgaon, Nandurbar, Maharashtra',
    initiative_for_translation_and_development_of_african_languages:
        'Initiative for the Translation and Development of African Languages',
    // Whole notices a parse couldn't reduce to a name
    malayalam_bible_binoy_chacko_audio_bible_nt_ot_binoy_chacko_ministries:
        'Binoy Chacko Ministries',
    yenziwe_yibiblica_inc_kanye_le_davar_partners_international: 'Biblica, Inc.',
    sociedad_bíblica_de_méxico_a_c_tzeltal_de_oxchuc_old_testament_audio_bible:
        'Bible Society of Mexico',
    nt_in_tamazight_of_the_middle_central_atlas_in_audio_published_by_bible_society_in_morocco:
        'Morocco Bible Society',
    mongolian_ab_audio_bible_davar_partners_international: 'Davar Audio Bibles',
    davar_partners_international_hosanna: 'Davar Audio Bibles',
    hosanna_hosanna: 'Faith Comes By Hearing',
    hosanna_nt: 'Faith Comes By Hearing',
    hosanna_nt_audio: 'Faith Comes By Hearing',
    hosanna_zeki_çiftçi: 'Faith Comes By Hearing',  // Zeki Çiftçi only holds the music
    hosanna_i_produsem_rikoding_ya_long: 'Faith Comes By Hearing',
    hosanna_rekoding_blong_bislama_revised_version: 'Faith Comes By Hearing',
    produccion_de_hosanna_en_nahuatl_de_la_huasteca: 'Faith Comes By Hearing',
    החברה_לכתבי_הקודש_בישראל_biblesocietyinisrael_comhaktuvim_co_il: 'Bible Society in Israel',
}

// ORG_ALIASES by folded slug, so an alias matches however the name is accented
const ALIASES = new Map(Object.entries(ORG_ALIASES).map(([slug, name]) => [fold(slug), name]))

// The name an org is listed under, where this is one of its other names
const alias_of = (name:string):string|undefined => ALIASES.get(fold(slugify(name)))

// The folded slugs of the names aliases are listed under, so a whole name can be checked against
// both
const ALIAS_TARGETS = new Set(Object.values(ORG_ALIASES).map(name => fold(slugify(name))))

// A website given after a name ("Lembaga Alkitab Indonesia www.alkitab.or.id"), sometimes with no
// space before it ("Bible Society of Kenyawww.biblesociety-kenya.org")
const TRAILING_WEBSITE_RE = /[\s,]*(www\.[\w.-]+\.[a-z]{2,})\/?$/i

function split_website(name:string):[string, string|undefined]{
    // Separate a website given after a name from the name itself
    const match = TRAILING_WEBSITE_RE.exec(name)
    if (!match || !match.index)
        return [name, undefined]
    return [name.slice(0, match.index), `https://${match[1]!.toLowerCase()}`]
}

function clean_owner_name(name:string):string{
    // Drop punctuation left dangling at the end of a name ("Barwani, .", "Odisha.") — but not
    // the period of an abbreviation ("Inc.", "Jr.", "e.V.", "Corp.")
    let cleaned = name.replace(/\s+/g, ' ').replace(/(?:\s*[,;:\-–]\s*\.?|\s+\.)+\s*$/, '').trim()
    const last_word = /(?:^|[^\p{L}.])(\p{L}+)\.$/u.exec(cleaned)?.[1]
    if (last_word && last_word.length >= 4 && last_word.toLowerCase() !== 'corp')
        cleaned = cleaned.slice(0, -1)
    return cleaned
}

export function get_or_create_owner(owners:Owner[], raw_name:string):string{
    // Find an existing owner by name (or one of its aliases), however accented, or add a new one —
    // returns its id. A website given after the name becomes the owner's website, if it has none.
    const [cleaned, website] = split_website(clean_owner_name(raw_name))
    const name = alias_of(cleaned) ?? cleaned
    const id = slugify(name)
    let owner = owners.find(o => fold(o.id) === fold(id))
    if (!owner){
        owner = {id, name}
        owners.push(owner)
    }
    if (website && !owner.website)
        owner.website = website
    return owner.id
}

// Many fetch.bible attributions are full copyright notices ("Copyright © 1927, 2009 Wycliffe
// Bible Translators, Inc.") rather than a bare org name — left as-is, the year list would splinter
// one org into a separate "owner" per copyright-year combination. Strip it down to the org name.
export function strip_copyright_notice(text:string):string{
    let name = text.trim()
    name = name.replace(/^copyright\s*/i, '')
    name = name.replace(/^\(c\)\s*/i, '')
    name = name.replace(/^©\s*/, '')
    // Each date token is a bare year ("2019") or a full ISO date ("2019-07-01") — a full date's
    // "-MM-DD" suffix isn't itself a year-range separator, so it must be consumed here too or it's
    // left dangling in front of the org name (e.g. "-07-01 Wycliffe Bible Translators, Inc.")
    const date_token = String.raw`\d{4}(?:-\d{2}-\d{2})?`
    name = name.replace(
        new RegExp(String.raw`^${date_token}(?:\s*[-–—,]\s*${date_token})*\s*`), '')
    return name.trim()
}

// Names that show up as an "attribution" or "rights holder" in source data but are really just a
// hosting/aggregation platform for texts they don't themselves hold rights to (most often public
// domain ones) — crediting them as the owner would be wrong, e.g. eBible.org mirrors plenty of
// translations it didn't produce and has no rights over. A source can add its own (lowercased).
export const AGGREGATOR_NAMES = new Set(['ebible.org'])

// Whether a name is just a hosting/aggregation platform (see AGGREGATOR_NAMES)
export const is_aggregator = (name:string):boolean =>
    AGGREGATOR_NAMES.has(strip_copyright_notice(name).toLowerCase())

// The translations a hosting platform does own itself, by name, credited to it once every source
// has had its say — eBible.org made the World English Bible (the World Messianic Bible is an
// edition of it), and is named as a co-holder of the Yorumsuz Türkçe Çeviri
export const AGGREGATOR_OWN_WORKS:Record<string, RegExp> = {
    'eBible.org':
        /\bworld (?:english|messianic) bible\b|\byorumsuz türkçe çeviri\b|\bturkish ytc\b/i,
}

// Names that copyright notices give as a holder, but that aren't really a rights holder — a
// translation project rather than a legal entity, the translation's own title, or prose a notice
// parse left behind
const NON_HOLDERS = new Set([
    'Urdu Geo Version', 'Sehwi Bible Sefwi Wiawso',
    'Mpoto Language Translation', 'Powari Madhya Pradesh', 'Obedience', 'Biel – Bienne',
    'UBB &WBT', 'M.B.S.: N.I.N.E.A. C9', 'Bible Translation', 'Literacy', '#ti',
    'ADI-Media, Via della Formica 23, 5 Roma, Italy',
    'Киелі Кітап, Қазақша аудармасы және көркемделуі «Орта Азия баспасы ЖШС»',
    'ཀལ༌ཏེས༌ བྲིས༌ཏེ༌ ཡོད༌ན༌ མན༌ནེ༌ འི༌ བྲིས༌ཁན༌ དང༌ སིལ༌ཁན༌ ཚང༌མའེ༌',
    'The Runyankole-Rukiga Audio Bible', 'Biblia Wayuu', 'The Konta New Testament',
].map(name => slugify(name)))

// Kinds of name that are always a translation project or committee rather than a legal entity
// ("Santhali Translation Project", "Koya Translation Samithi" — samiti being Hindi for committee),
// or rights boilerplate from a notice (often in another language) rather than a name
const NON_HOLDER_RE = new RegExp([
    '\\b(?:translation|language)\\s+(?:project|team|committee)\\b', '\\bsamit?h?i\\b',
    '\\bcommittee of\\b', '\\btrademark office\\b', 'reserv', 'derechos', 'direitos', '\\bregte\\b',
    'zimehifadhiwa', '\\bact\\b', '§', 'weergawe', 'toestemming', '^holder$', '^publicado\\b',
    '^good news translation\\b',
].join('|'), 'i')

export function owner_id_for(owners:Owner[], attribution:string):string{
    // "public domain" (or a blank attribution) isn't a rights holder — don't invent a fake owner
    // for it, just leave the license terms owner as 'unknown'. Same for a bare hosting platform.
    const name = strip_copyright_notice(attribution)
    // A name starting in lowercase is left-over prose ("der deutschen Ausgabe und")
    if (!name || /^(?:public domain|anonymous)$/i.test(name) || is_aggregator(name)
            || NON_HOLDERS.has(slugify(clean_owner_name(name))) || NON_HOLDER_RE.test(name)
            || /^\p{Ll}/u.test(name.replace(/^the\s+/i, '')))
        return 'unknown'
    return get_or_create_owner(owners, name)
}

// The owner ids for a list of owner names, without duplicates or 'unknown'
export function owner_ids_for(owners:Owner[], names:string[]):string[]{
    return [...new Set(names.map(name => owner_id_for(owners, name)))]
        .filter(owner_id => owner_id !== 'unknown')
}

// Add one text license terms entry per owner, or a single 'unknown' one where none are known
export function push_terms(license_terms:LicenseTerms[], translation_id:string,
        owner_ids:string[], license:string, url:string):void{
    for (const owner_id of owner_ids.length ? owner_ids : ['unknown']){
        license_terms.push({
            translation_id,
            owner_id,
            roles: ['text'],
            license,
            url,
            last_verified: today(),
        })
    }
}

export const today = ():string => new Date().toISOString().slice(0, 10)


// ---- license detection (ported from fetch.bible's collector/src/parts/license.ts) ----

const STANDARD_LICENSES = new Set([
    'public', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'cc-by-nc-sa', 'cc-by-nd', 'cc-by-nc-nd',
])

function license_from_url(url:string):{license:string, url:string}|null{
    const clean = url.replace(/[^\x20-\x7E]/g, '')
    const normalized = clean.replace(/^http:/, 'https:').replace(/\/?$/, '/')
    const cc_match = /creativecommons\.org\/licenses\/(by[a-z-]*)\//i.exec(normalized)
    if (cc_match){
        const license = `cc-${cc_match[1]!.toLowerCase()}`
        if (STANDARD_LICENSES.has(license))
            return {license, url: normalized}
    }
    if (/creativecommons\.org\/publicdomain\/zero\//i.test(normalized))
        return {license: 'public', url: normalized}
    return null
}

// A Creative Commons license written out as a code or name rather than a URL, e.g.
// "CC BY-NC-SA 4.0", "CC-BY-SA-4.0", or "Creative Commons Attribution-ShareAlike"
function license_from_cc_name(text:string):string|null{
    if (/\bCC0\b|\bCC\s+zero\b/i.test(text))
        return 'public'

    // Collect which of the NC/SA/ND clauses the license names
    let clauses:string[]|null = null
    const code_match = /\bCC[\s-]*BY((?:[\s-]*(?:NC|SA|ND)\b)*)/i.exec(text)
    if (code_match){
        clauses = code_match[1]!.toLowerCase().match(/nc|sa|nd/g) ?? []
    } else {
        const name_re =
            /creative\s+commons\s*(?:license\s*:?\s*)?[-–]?\s*attribution([\w\s-]{0,40})/i
        const name_match = name_re.exec(text)
        if (name_match){
            const rest = name_match[1]!.toLowerCase()
            clauses = []
            if (/non[\s-]?commercial/.test(rest)) clauses.push('nc')
            if (/share[\s-]?alike/.test(rest)) clauses.push('sa')
            if (/no[\s-]?deriv/.test(rest)) clauses.push('nd')
        }
    }
    if (!clauses)
        return null

    // Assemble in the standard clause order, e.g. 'cc-by-nc-sa'
    const found = clauses
    const license = ['cc-by', ...['nc', 'sa', 'nd'].filter(c => found.includes(c))].join('-')
    return STANDARD_LICENSES.has(license) ? license : null
}

export function license_from_text(text:string):{license:string, url:string}|null{
    // A license the notice names in its own words wins over a link to a different one, as the
    // words are what readers see ("[CC-BY-NC-ND](https://creativecommons.org/licenses/by-sa/4.0/)")
    const named = license_from_cc_name(text.replace(/https?:\/\/\S+/g, ' '))
    const url_match =
        /https?:\/\/creativecommons\.org\/(?:licenses|publicdomain)\/[^\s"'<>()]+/i.exec(text)
    if (url_match){
        const detected = license_from_url(url_match[0])
        if (detected && (!named || named === detected.license))
            return detected
    }
    const cc_license = named ?? license_from_cc_name(text)
    if (cc_license)
        return {license: cc_license, url: ''}
    if (/public domain/i.test(text) && !/not public domain/i.test(text))
        return {license: 'public', url: ''}
    return null
}


// ---- copyright notice holders ----

// Boilerplate that marks the end of a holder's name within a copyright notice
const HOLDER_END_RE = new RegExp([
    'all rights reserved', 'licensed', 'released under', 'made available under',
    'creative commons', 'attribution', 'cc[\\s-]*by', 'cc0', 'for church use only',
    'used (?:by|with) permission', 'must appear', 'is a trademark', 'original publication',
    'current version', 'grabad\\w* por', 'recorded by', 'under\\s+cc',
    'in (?:co-?operation|collaboration|partnership) with', 'audio:', 'text:', ';', '\\n',
    'for the audio', 'but has been', 'info at',
    '\\b(?:first|second|third|fourth|fifth|premi[eè]re|deuxi[eè]me|troisi[eè]me)\\s+[ée]dition',
    '\\bfor\\s+(?:complete|following)\\b', '\\bthis work\\b', '\\(text\\)',
    '\\ble texte biblique\\b',
    // A postal address ("B.P. 1133", "P.O. Box 790")
    '\\b(?:b\\.\\s?p\\.|p\\.\\s?o\\.\\s?box)\\s*\\d',
].join('|'), 'i')

// HTML entities for accented letters ("&auml;"), by name, as the combining mark they add
const ENTITY_MARKS:Record<string, string> = {
    acute: '́', grave: '̀', uml: '̈', circ: '̂', cedil: '̧', tilde: '̃',
}

export function clean_holder(segment:string):string{
    // Reduce one ©/℗ notice segment ("2005, Wycliffe Bible Translators, Inc. All rights
    // reserved.") down to just the holder's name ("Wycliffe Bible Translators, Inc.")
    // Some statements run sentences together with no space ("...Davar Partners
    // InternationalBiblica® Open..."), so a trademarked title glued onto a name also ends it
    // A sentence break ("Michael Adeyemi Adegbola. This Scripture text is...", or after a year or
    // an aside following the name: "Davar Partners International, 2022. Kasem Audio Bible") also
    // ends it, but not an abbreviation's period ("Inc.", "Jr.", "W.")
    let name = segment.replace(/&amp;|\bamp\b/g, '&').replace(/<[^>]*>?/g, ' ')
        .replace(/&([a-z])(acute|grave|uml|circ|cedil|tilde);/gi, (_, letter:string, mark:string) =>
            (letter + ENTITY_MARKS[mark.toLowerCase()]).normalize('NFC'))
        .replace(/️|(?<=\p{Nd})\p{M}+/gu, '')
        // "Copyright owned by" in Chinese, which can come before or after the name
        .replace(/版[權权]所有[：:]?/g, ' ')
        .replace(/(\p{Ll})(?=\p{Lu}\S*[®™])/gu, '$1\n')
        .replace(/(?:scripture\s+)?(?:text|audio)\s+used\s+by\s+permission(?:\s+of\s+)?/i, '')
    name = name.split(
        /(?<=\p{Ll}{3}|\p{L}[\s,]+\p{Nd}{4}|\p{L}[^(]*\([^)]*\))\.\s+(?=\p{Lu})/u)[0]!
    name = name.split(HOLDER_END_RE)[0]!
    // Links and parenthesised asides aren't part of a name, nor are any brackets they leave behind,
    // nor years (or placeholders for one, "202_"), nor markdown emphasis ("_SIL International._")
    name = name.replace(/https?:\/\/\S+/g, '').replace(/\([^)]*\)|[[\]\\"*()]/g, '')
        .replace(/\p{Nd}{4}|\b20[\p{Nd}_]{2}\b|\byear\b|_/giu, '')
    name = name.replace(/^[\s:,.\-–—/&]*(?:(?:audio|text|by|por|von|par)\b\s*)*/i, '')
        .replace(/(?:[\s,;:\-–/&]|\b(?:and|et|und)\b)+$/i, '')
    name = name.replace(/\s+/g, ' ').trim()
    // Anything left without a single letter isn't a name
    return /\p{L}/u.test(name) ? name : ''
}

function strip_acronym(name:string):string{
    // Drop a leading acronym that just repeats a longer name ("CET - Communauté des Eglises
    // Travaillistes"), but not one that's part of a short name ("FCBH - Malaysia")
    return name.replace(/^[\p{L}.]{2,8}\s+[-–]\s+(?=\S+\s+\S+\s+\S)/u, '')
}

// The initials of an org's name, less any location after a comma and any lowercase words ("ibt"
// for "Institute for Bible Translation, Russia")
const initials = (name:string):string => name.split(',')[0]!.split(/[\s/-]+/)
    .filter(word => /^\p{Lu}/u.test(word)).map(word => word[0]!.toLowerCase()).join('')

function resolve_org_name(name:string, entry_orgs:string[]):string{
    // Map a notice's short form of a name onto the org's full name — either a known alias, or
    // one of the entry's own orgs that it abbreviates ("Hosanna" for "Hosanna/Faith Comes By
    // Hearing", "Wycliffe" for "Wycliffe Bible Translators, Inc.", "IBT" for "Institute for Bible
    // Translation, Sweden")
    const alias = alias_of(name)
    if (alias)
        return alias
    const slug = fold(slugify(name))
    for (const org of entry_orgs){
        const org_slug = fold(slugify(org))
        if (slug && (org_slug === slug || org_slug.startsWith(`${slug}_`)
                || (/^\p{Lu}{3,}$/u.test(name) && slug === initials(org))))
            return org
    }
    return name
}

// Org names already known, by folded slug — `embeddable` is the subset specific enough to be picked
// out from inside a longer name (a source's own orgs, and names of 3+ words), so a short name like
// "Wycliffe" doesn't swallow "Wycliffe India"
export interface OrgIndex {
    known:Map<string, string>
    embeddable:string[]
}

function known_orgs_in(name:string, entry_orgs:string[], orgs:OrgIndex):string[]{
    // The known orgs a holder name refers to — itself if it is one (or abbreviates one of the
    // entry's own orgs), else any known org names embedded in it, e.g. from a notice in another
    // language ("Biblica, Inc. і Davar Partners International")
    const resolved = resolve_org_name(name, entry_orgs)
    if (resolved !== name || orgs.known.has(fold(slugify(name))))
        return [resolved]
    // A one-word name only counts at the start, or after "by" or a word in another script ("על ידי
    // Biblica"), so "Biblica" isn't found in "Sociedad Biblica de Guatemala"
    const padded = `_${fold(slugify(name))}_`
    const found = orgs.embeddable.filter(slug => padded.includes(`_${slug}_`)
        && (slug.includes('_') || padded.startsWith(`_${slug}_`)
            || new RegExp(`_(?:by|[^_\\p{Script=Latin}]+)_${slug}_`, 'u').test(padded)))
    // Only the longest match counts where one known name contains another
    return found.filter(slug => !found.some(other => other !== slug && other.includes(slug)))
        .map(slug => orgs.known.get(slug)!)
}

export function split_holders(name:string, entry_orgs:string[], orgs:OrgIndex):string[]{
    // Co-holders are listed with commas before an acronym ("NHGM - New Harvest Global Ministries,
    // TSCo - Seed Co."), or joined by "and"/"&" — but an "and" only separates known orgs from the
    // rest, since otherwise it's more likely part of a single name ("Language Developers and Bible
    // Translators and Hosanna" is two holders, not three)
    const holders:string[] = []
    for (const listed of name.split(/,\s*(?=[\p{L}.]{2,8}\s+[-–]\s)/u)){
        // A whole name that's a known alias is one holder, even with an "and"/"&" in it
        // ("Cambridge University Press & Assessment", "British and Foreign Bible Society")
        const whole = clean_holder(listed)
        if (alias_of(whole) || ALIAS_TARGETS.has(fold(slugify(whole)))){
            holders.push(resolve_org_name(whole, entry_orgs))
            continue
        }
        let pending:string[] = []
        const flush = () => {
            if (pending.length)
                holders.push(resolve_org_name(strip_acronym(pending.join(' and ')), entry_orgs))
            pending = []
        }
        const parts = listed.split(/\s+(?:and|&)\s+/i).map(clean_holder).filter(Boolean)
        for (const part of parts.map(strip_acronym)){
            const found = known_orgs_in(part, entry_orgs, orgs)
            if (found.length){
                flush()
                holders.push(...found)
            } else {
                pending.push(part)
            }
        }
        flush()
    }
    return holders
}

export function build_org_index(owners:Owner[], source_orgs:string[]):OrgIndex{
    // Every org name already known, for picking org names out of messy notices — a source's own
    // orgs are always specific enough to be embeddable
    const known = new Map(owners.map(o => [fold(o.id), o.name]))
    for (const [alias, name] of ALIASES){
        known.set(alias, name)
        known.set(fold(slugify(name)), name)
    }
    const source_slugs = new Set<string>()
    for (const org of source_orgs.filter(Boolean)){
        known.set(fold(slugify(org)), org)
        source_slugs.add(fold(slugify(org)))
    }
    return {
        known,
        embeddable: [...known.keys()]
            .filter(slug => source_slugs.has(slug) || slug.split('_').length >= 3),
    }
}


// ---- source data shared between steps ----

// Every DBL uid and eBible id that find.bible links each of its translations to — one translation
// often links several DBL entries (e.g. ARBNAV links both its 1997 and 2012 editions), so these
// keep all of them, not just the single uid stored in external_ids.dbl
export interface FindBibleIndex {
    by_dbl:Map<string, Set<string>>  // DBL uid -> find.bible ids
    by_ebible:Map<string, Set<string>>  // lowercased eBible id -> find.bible ids
}

// find.bible's versions (not yet listed — the private steps may supersede some) and their links
export interface FindBible {
    versions:Translation[]
    index:FindBibleIndex
    dbl_uids:Map<string, string[]>  // find.bible id -> every DBL uid it links to
}

export interface FetchBibleEntry {
    name:{english:string, english_abbrev:string}
    year:number
    copyright:{
        // 'license' is a standard license key string, or an inline restrictions object for a
        // translation whose terms don't match any of the standard ones — treat that as 'custom'
        licenses:{license:string|Record<string, unknown>, url:string}[]
        attribution:string
        attribution_url:string
    }
}

// The DBL/eBible ids fetch.bible's collection records for a translation (its source meta.json)
export interface FetchCollectionIds {
    dbl?:string
    ebible?:string
}

// fetch.bible's translations, the DBL/eBible ids its collection records for each, and its
// languages (keyed by ISO 639-3 code)
export interface FetchBible {
    bibles:Record<string, FetchBibleEntry>
    collection_ids:Map<string, FetchCollectionIds>
    languages:Record<string, {english:string}>
}

// fetch.bible's language code for a translation — its ids are always '<language>_<name>'
export const fetch_language = (fb_id:string):string => fb_id.split('_')[0]!

// Individual languages that sources sometimes code by their macrolanguage instead, by code (DBL
// codes one Asante Twi Bible 'aka', for Akan, but the rest 'twi') — only those seen to split one
// translation's entries
const MACROLANGUAGES:Record<string, string> = {
    twi: 'aka', fat: 'aka', nno: 'nor', nob: 'nor', azb: 'aze', azj: 'aze', ike: 'iku', lvs: 'lav',
    uzn: 'uzb',
}

export function related_languages(code:string):string[]{
    // The codes that are the same language as `code` — itself, the macrolanguage it's also coded
    // by, or the individual languages it's coding — but never two individual languages of one
    // macrolanguage (e.g. Northern and Southern Azerbaijani)
    const macro = MACROLANGUAGES[code]
    return [code, ...macro ? [macro] : [],
        ...Object.keys(MACROLANGUAGES).filter(member => MACROLANGUAGES[member] === code)]
}

// Whether two language codes are the same language (see related_languages)
export const same_language = (a:string, b:string):boolean => related_languages(a).includes(b)

// The code to group a language under where versions are keyed by language — its macrolanguage's,
// if it's sometimes coded by that (see MACROLANGUAGES)
export const language_key = (code:string):string => MACROLANGUAGES[code] ?? code

// A language in find.bible's languages.json
export interface FindBibleLanguage {
    iso:string  // ISO 639-3 code
    tt:string  // English name
}

// The English name of each language code given, from find.bible's languages, else fetch.bible's —
// codes neither knows (mostly retired ones) are left out, so the site shows the code itself
export function language_names(codes:Iterable<string>, find_bible:FindBibleLanguage[],
        fetch_bible:FetchBible['languages']):Record<string, string>{
    const find_bible_names = new Map(find_bible.map(lang => [lang.iso, lang.tt.trim()]))
    const names:Record<string, string> = {}
    for (const code of [...new Set(codes)].sort()){
        const name = find_bible_names.get(code) || fetch_bible[code]?.english
        if (name)
            names[code] = name
    }
    return names
}

// The dataset being built, plus the public sources already loaded
export interface BuildState {
    translations:Translation[]
    owners:Owner[]
    license_terms:LicenseTerms[]
    find_bible:FindBible
    fetch_bible:FetchBible
}

// The private steps, in the order update_watch_data.ts runs them (implemented in .private/)
export interface DblSteps {
    // Refresh the private cache, if asked to — runs first, as it may prompt
    refresh_catalog():Promise<void>
    // List text entries, returning the find.bible ids they supersede
    add_text(state:BuildState):Set<string>
    // Add terms to listed versions (and list any versions only it knows of), before other
    // sources fill in the rest — may prompt
    add_terms(state:BuildState):Promise<void>
    // List audio recordings
    add_audio(state:BuildState):void
    // Resolve whatever can still be resolved, after translations too old to track are dropped
    resolve_remaining(state:BuildState):Promise<void>
    // Fill in owner details (websites), once every source has added its owners
    add_owner_websites(state:BuildState):void
}


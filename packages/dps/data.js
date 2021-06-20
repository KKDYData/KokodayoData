import dps_options from "./customdata/dps_options.json"
import dps_specialtags from "./customdata/dps_specialtags.json"
import green from "./customdata/green.json"
import leveling_cost from "./customdata/leveling_cost.json"

export var _cache = {};
export var _spec = null;

export function get(key) { return _cache[key]; }

export function getSpec(id, key) {
    _spec = dps_specialtags[id] ? dps_specialtags[id][key] : null;
    return _spec;
}

export function loadKkdyChar(char) {
    var charId = char.info.charID;
    _cache[charId] = char.data;

    char.skills.forEach(s => {
        _cache[s.data.skillId] = s.data;
    })
}

export { dps_options, dps_specialtags, green, leveling_cost }



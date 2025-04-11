// js/utils.js
function getColorByType(type) {
    const colors = {
        "Noble Gas": 0x82ffff,
        "Alkali Metal": 0xff6666,
        "Alkaline Earth Metal": 0xffff66,
        "Transition Metal": 0xb9b9ff,
        "Metalloid": 0xffb366,
        "Non-metal": 0x99ff99,
        "Lanthanide": 0xb9ff82,
        "Actinide": 0xffb6ba,
        "Post Transition Metal": 0x8a2be2
    };
    return colors[type] || 0xffffff;
}
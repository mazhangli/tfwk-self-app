<template>
    <div ref="menupadRoot" class="flex-c-c content" v-if="show === false">
        <div class="menu_wid" :style="areas">
            <app-menu :menu="menu" @subfield="onSubfield" v-for="(menu, i) in newarray" :key="i" :style="menu.style" />
        </div>
    </div>
    <div class="content flex-c-c" v-if="show === true">
        <menu-subfield :subfields="subfields" @cancel="show = false" />
    </div>
    <rove-button v-if="show === false" />
</template>
    
<script lang="ts">
import { getStore } from '@/utils/cache/storage';
import { defineComponent, effect, onBeforeMount, onMounted, reactive, ref, toRaw, toRefs, unref } from 'vue';
import AppMenu from './Menu.vue';
import MenuSubfield from './Subfield/Subfield.vue';
import RoveButton from '@/components/terminal/button/RoveButton.2.vue';
import { getArea, getAreabyStore } from './menu.query';
import { useRect } from '@vant/use';

const menupadRoot = ref(null) as any;

export default defineComponent({
    name: 'MenuPad',
    props: {},
    components: { AppMenu, MenuSubfield, RoveButton },
    setup() {
        const state = reactive({
            show: false,
            token: 0,
            menus: [] as any[],
            newarray: [] as any[],
            column: 5,
            row: 6,
            areas: '',
            gutter: '5px',
            subfields: [] as any[],
            gridStyle: [] as any[],
        });
        onBeforeMount(() => {
            var w = document.documentElement.clientWidth;
            var h = document.documentElement.clientHeight;
            if (w > h) {
                w = Math.floor(w * 0.7);
                state.column = 4;
                state.row = Math.floor(h / (w / state.column)) * 2;
            } else {
                w = Math.floor(w * 0.9);
                h = Math.floor(h * 0.8);
                state.column = 3;
                state.row = Math.floor(h / (w / state.column)) * 2;
            }
            console.log(state.row, state.column);
        });
        onMounted(() => {
            const rect = useRect(menupadRoot);
            // var IMenu = [
            //     { R: 0, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 0, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 0, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 0, C: 3, area: '', fill: false, menu: null as any },
            //     { R: 1, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 1, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 1, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 1, C: 3, area: '', fill: false, menu: null as any },
            //     { R: 2, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 2, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 2, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 2, C: 3, area: '', fill: false, menu: null as any },
            //     { R: 3, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 3, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 3, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 3, C: 3, area: '', fill: false, menu: null as any },
            //     { R: 4, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 4, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 4, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 4, C: 3, area: '', fill: false, menu: null as any },
            //     { R: 5, C: 0, area: '', fill: false, menu: null as any },
            //     { R: 5, C: 1, area: '', fill: false, menu: null as any },
            //     { R: 5, C: 2, area: '', fill: false, menu: null as any },
            //     { R: 5, C: 3, area: '', fill: false, menu: null as any },
            // ];
            var IMenu = [] as any[];
            for (var _i = 0; _i < state.column * state.row; _i++) {
                IMenu.push({ R: Math.floor(_i / state.column), C: _i % state.column, area: '', fill: false, menu: null as any });
            };
            console.log(IMenu);
            state.gridStyle = ['grid-template-columns: repeat(' + state.column + ', 1fr)', 'grid-template-rows: repeat(' + state.row + ', 1fr);'];
            state.areas = "grid-template-areas: ";
            state.menus = getStore('menu');
            const to = getAreabyStore();
            //state.newarray = state.menus;
            if (state.menus && state.menus.length > 0) {
                state.menus.forEach((item: any) => {
                    if (item.children && item.children.length > 0) item.type = 'main';

                    var match = null as any;
                    if (item.type === 'main') {
                        match = IMenu.find((s) => { return s.fill === false && s.R % 2 === 0; });
                        match.fill = true;
                        match.area = item.menucode.replaceAll('.', '').toUpperCase();
                        match.menu = toRaw(item);
                        match.menu.style = "grid-area:" + item.menucode.replaceAll('.', '').toUpperCase() + ";";
                        //data.push(match);

                        match = IMenu.find((s) => { return s.C === match.C && s.R === match.R + 1; });
                        match.fill = true;
                        match.area = item.menucode.replaceAll('.', '').toUpperCase();
                        match.menu = toRaw(item);
                        match.menu.style = "grid-area:" + item.menucode.replaceAll('.', '').toUpperCase() + ";";
                        //data.push(match);
                    } else {
                        match = IMenu.find((s) => { return s.fill === false; });
                        match.fill = true;
                        match.area = item.menucode.replaceAll('.', '').toUpperCase();
                        match.menu = toRaw(item);
                        match.menu.style = "grid-area:" + item.menucode.replaceAll('.', '').toUpperCase() + ";";
                        //data.push(match);
                    }
                });
                IMenu.forEach((item, index) => {
                    if ((index) % state.column === 0) state.areas += "'";
                    state.areas += item.area ? item.area + " " : '. ';
                    if ((index + 1) % state.column === 0) state.areas += "'";
                });
                if (state.areas.endsWith("'"))
                    state.areas += ' !important;';
                else
                    state.areas += "' !important;";
                state.areas += 'grid-template-columns: repeat(' + state.column + ', 1fr); grid-template-rows: repeat(' + state.row + ', 1fr);';
                console.log(state.areas);
                var y = Array.from(new Set(IMenu.filter(t => t.menu != null).map(s => s.menu)));
                state.newarray = y;
                console.log(state.newarray);
            }
        });

        const onSubfield = function (subfields: any) {
            state.show = true;
            state.subfields = subfields;
        };
        return { ...toRefs(state), onSubfield, menupadRoot };
    },
});
</script>
    
<style lang="less">
.menupad {
    width: 100%;
    height: 100%;
    position: relative;
}

.menu_wid {
    min-width: 65%;
    max-width: 95%;
    height: 95%;
    // width: 100%;
    display: grid;
    grid-auto-flow: row dense;
    // grid-template-columns: repeat(4, 1fr);
    // grid-template-rows: repeat(6, 1fr);
    grid-gap: 0.1rem;
}

.menu_col {
    // flex-basis: 25%;
    width: 4.5rem;
    height: 4rem;
    margin: 8px;
}
</style>
    
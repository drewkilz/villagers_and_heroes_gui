<template>
    <div id="contact" class="page-header">
        <div class="mt-1">Looking to contact me?</div>
        <ul>
            <li>Have suggestions or feedback on the tools?</li>
            <li>An idea for a new one?</li>
            <li>Found a bug?</li>
            <li>Just want to let me know you like what you see?</li>
        </ul>
        <p class="font-weight-bold">Contact details:</p>
        <ul>
            <li>E-mail: <b-img rounded="true" :src="require('../assets/vnh_tsl.png')"></b-img></li>
            <li><b-link href="https://github.com/drewkilz/villagers_and_heroes_gui/issues" target="_blank" rel="noopener">GitHub Issue Tracker</b-link> (please add an issue if there is a bug or enhancement you'd like)</li>
            <li>In-game: [US2] Tallonar Daryth</li>
        </ul>
        <p>If you are familiar with Python and/or Vue.js and would like to fix a bug or add a feature, please let me know! The source is available at GitHub, so fork away and send me a pull request.</p>
        <ul>
            <li><b-link href="https://github.com/drewkilz/villagers_and_heroes_api" target="_blank" rel="noopener">Villager and Heroes - API [Python]</b-link></li>
            <li><b-link href="https://github.com/drewkilz/villagers_and_heroes_gui" target="_blank" rel="noopener">Villager and Heroes - GUI [Vue.js]</b-link></li>
        </ul>
        <p>You can see what I am currently working on here: <b-link href="https://github.com/users/drewkilz/projects/1?fullscreen=true" target="_blank" rel="noopener">Villager & Heroes Project</b-link></p>
    </div>
</template>

<script>
    export default {
        name: 'Contact'
    }
</script>

<template>
    <div>
        <footer class="footer footer-navbar-override">
            <div class="text-muted">
                <b-row class="bg-dark">
                    <b-col cols="12" md="8" class="text-left">
                        <b-link href="https://villagersandheroes.com" target="_blank" rel="noopener">Villagers &
                            Heroes
                        </b-link>
                        is
                        a registered trademark of
                        <a href="https://www.madottergames.com" target="_blank" rel="noopener">Mad Otter Games</a>
                    </b-col>
                    <b-col cols="6" md="4" class="text-right">
                        <router-link to="/policies">Policies</router-link> |
                        <router-link to="/contact">Contact</router-link> |
                        <router-link to="/credits">Credits</router-link>
                    </b-col>
                </b-row>
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>

<style>
    /*
  Originally sourced from: https://getbootstrap.com/docs/4.1/examples/sticky-footer-navbar/, then customized.
  */

    /* Sticky footer styles
    -------------------------------------------------- */
    html {
        position: relative;
        min-height: 100%;
    }

    body {
        margin-bottom: 50px; /* Margin bottom by footer height */
    }

    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
        height: 50px; /* Set the fixed height of the footer here */
        line-height: 50px; /* Vertically center the text there */
    }

    /* Overrides for the navbar class when applied to footer */
    .footer-navbar-override {
        margin-bottom: 0;
        border: none;
    }

    .footer a {
        color: rgba(255, 255, 255, 0.5);
    }

    .footer a:hover {
        color: rgba(255, 255, 255, 0.75);
        text-decoration: none;
    }

</style>
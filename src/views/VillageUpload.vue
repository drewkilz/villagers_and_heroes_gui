<template>
    <div id="upload">
        <p>
            This tool is utilized to provide data for the Village analysis tools. To utilize, upload images containing either:
        </p>
        <ul>
            <li>Roster data, or</li>
            <li>Village Project data</li>
        </ul>
        <div class="font-weight-light font-italic">
            NOTES:
            <ul>
                <li>
                    Processing the images takes time, so be patient. It is estimated that it takes between 10-15
                    seconds per image.
                </li>
                <li>
                    Only screenshots taken on the PC version of the game are currently supported.
                </li>
            </ul>
        </div>
        <!--FAILED-->
        <div v-if="isFailed">
            <h2>Upload failed.</h2>
            <pre>{{ uploadError }}</pre>
        </div>
        <form enctype="multipart/form-data" novalidate>
            <b-row>
                <b-col cols="1"><label for="form-server">Server</label></b-col>
                <b-col md="auto">
                    <b-form-select
                            id="form-server"
                            v-model="server"
                            :options="serverOptions"
                            size="sm">
                    </b-form-select>
                </b-col>
            </b-row>
            <div class="dropbox">
                <input type="file" multiple :name="uploadFieldName" :disabled="isSaving || isProcessing"
                       @change="filesChange($event.target); fileCount = $event.target.files.length"
                       accept="image/*" class="input-file">
                <p v-if="!isSaving && !isProcessing">
                    Drag your file(s) here to begin<br> or click to browse
                </p>
                <p v-if="isSaving">
                    Uploading {{ fileCount }} file(s)...
                </p>
                <p v-if="isProcessing">
                    Uploaded {{ fileCount }} file(s).<br/>
                    Processing... ({{ elapsedTime }} seconds elapsed)
                </p>
            </div>
        </form>
        <div id="results" v-if="results">
            <p><span class="font-weight-bold">Results:</span></p>
            <div v-html="results"></div>
        </div>
        <div id="examples">
            <p>Example Images:</p>
            <b-row>
                <b-col cols="6">
                    <p class="font-weight-bold text-center"><u>Roster</u></p>
                    <b-link :href="require('../assets/examples/roster.png')">
                        <b-img alt="Roster Example" fluid-grow rounded="true" center :src="require('../assets/examples/roster.png')"></b-img>
                    </b-link>
                </b-col>
                <b-col cols="6">
                    <p class="font-weight-bold text-center"><u>Village Project</u></p>
                    <b-link :href="require('../assets/examples/project.png')">
                        <b-img alt="Village Project Example" fluid-grow rounded="true" center :src="require('../assets/examples/project.png')"></b-img>
                    </b-link>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import { upload, status, getCategory } from '@/vnhApi'
    import { compareValues } from '@/utility'

    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_FAILED = 2, STATUS_PROCESSING = 3

    export default {
        name: 'VillageUpload',
        data() {
            return {
                uploadError: null,
                currentStatus: null,
                uploadFieldName: 'images',
                elapsedTime: 0,
                startTime: null,
                results: null,
                server: null,
                serverOptions: []
            }
        },
        computed: {
            isSaving() {
                return this.currentStatus === STATUS_SAVING
            },
            isFailed() {
                return this.currentStatus === STATUS_FAILED
            },
            isProcessing() {
                return this.currentStatus === STATUS_PROCESSING
            }
        },
        methods: {
            save(formData, target) {
                this.currentStatus = STATUS_SAVING

                upload(formData)
                    .then(data => {
                        this.currentStatus = STATUS_PROCESSING
                        this.elapsedTime = 0
                        this.startTime = new Date().getTime()

                        this.saveStatus(data.status_url, target)
                    })
                    .catch(err => {
                        this.uploadError = err.response
                        this.currentStatus = STATUS_FAILED
                    })
            },
            saveStatus(status_url, target) {
                status(status_url)
                    .then(response => {
                        if (response) {
                            if (response.status === 202) {
                                let location = response.headers['location']
                                let retry = parseInt(response.headers['retry-after'])

                                this.elapsedTime = Math.round(((new Date()).getTime() - this.startTime) / 1000)

                                setTimeout(() => this.saveStatus(location, target), retry * 1000)
                            }
                            else if (response.status === 200) {
                                this.results = `<p>Uploaded ${target.files.length} file(s) successfully for village: '${response.data.village}' (${response.data.server}) in ${response.data.processing_time} seconds.</p>`
                                if (response.data.roster.length !== 0) {
                                    this.results += `
<h3>Processed Roster Details</h3>
<div>${response.data.roster.length} roster snapshot(s) found.</div>`

                                    for (let index in response.data.roster) {
                                        let snapshot = response.data.roster[index]
                                        this.results += `
<h4>Snapshot ${parseInt(index) + 1}</h4>
<h5>Images</h5>
<ul>`
                                        for (let image_index in snapshot.original_images) {
                                            let image = snapshot.original_images[image_index]
                                            let timestamp = snapshot.timestamps[image_index]
                                            this.results += `<li>${image} @ ${new Date(timestamp)}</li>`
                                        }

                                        this.results += `
</ul>
<h5>Entries</h5>
<ul>`

                                        for (let entry_key in snapshot.entries) {
                                            let entry = snapshot.entries[entry_key]
                                            this.results += `<li><pre>${entry.rank.custom_name.padEnd(25)}${entry.name.padEnd(25)}${entry.level}</pre></li>`
                                        }

                                        this.results += '</ul>'
                                    }
                                }
                                this.currentStatus = STATUS_INITIAL
                                this.elapsedTime = 0
                                this.startTime = null
                                target.value = ''
                            }
                        }
                    })
            },
            filesChange(target) {
                // handle file changes
                const formData = new FormData()

                this.uploadError = null
                this.results = null

                console.log(target.files.length)

                if (!target.files.length)
                    return

                // append the files to FormData
                Array
                    .from(Array(target.files.length).keys())
                    .map(x => {
                        formData.append(target.name, target.files[x], target.files[x].name);
                        formData.append('imageDates', target.files[x].lastModified);
                    })

                if (this.server === null) {
                    this.uploadError = 'You must select the server the village exists on before uploading.'
                    this.currentStatus = STATUS_FAILED
                    target.value = ''
                    return
                }
                formData.append('server', this.server)

                // save it
                this.save(formData, target)
            },
            getOptions(name) {
                let options = []

                return getCategory(name).then(data => {
                    let types = data.types
                    for (let index in types) {
                        let type = types[index]
                        options.push({text: type.name, value: type.name})
                    }

                    options.sort(compareValues('text'))

                    return options
                })
            },
        },
        mounted() {
            this.currentStatus = STATUS_INITIAL
            this.getOptions('Server').then(data => {this.serverOptions = data})
        },
    }
</script>

<style scoped>
    .dropbox {
        outline: 2px dashed grey; /* the dash box */
        outline-offset: -10px;
        background: lightgrey;
        color: dimgray;
        padding: 10px 10px;
        min-height: 100px; /* minimum height */
        position: relative;
        cursor: pointer;
        margin-bottom: 15px;
    }

    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 100%;
        height: 100px;
        position: absolute;
        cursor: pointer;
    }

    .dropbox:hover {
        background: darkgrey; /* when mouse over to the drop zone, change color */
    }

    .dropbox p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
        margin-bottom: 0;
    }
</style>
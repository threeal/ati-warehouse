<template>
    <section>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="mx-auto">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Login form</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-text-field
                                    label="Email"
                                    v-model="email"
                                    prepend-icon=""
                                    type="text"
                                    :rules="emailRules"
                                    required
                                ></v-text-field>
 
                                <v-text-field
                                    label="Password"
                                    v-model="password"
                                    prepend-icon=""
                                    type="password"
                                    :rules="passwordRules"
                                    required
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="primary" :disabled="!valid" @click="doLogin">Login</v-btn>
                            <v-btn color="primary" link to="/Register">Register</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-snackbar v-model="snackbar" bottom>
                        {{error_message}}
                    </v-snackbar>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>
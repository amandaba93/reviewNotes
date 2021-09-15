<template>
  <v-app>
    
    <v-main>
      <ReviewNotes/>
    </v-main>
  </v-app>
</template>

<script>
import ReviewNotes from './components/ReviewNotes';

export default {
  name: 'App',

  components: {
    ReviewNotes,
  },

  data: () => ({
    //
  }),
};
</script>

<template>
  <v-container>
    <v-row>
      <v-breadcrumbs
        :items=breadcrumbItems
        divider=">"
      >
      </v-breadcrumbs>
    </v-row>

     <!-- Row with header and new button -->
    <v-row class="">
      <v-col class="mb-4 d-flex align-center">
        <h1 class="text-2 font-weight-bold mr-5">
          Review notes
        </h1>
        <v-btn
          color="primary"
          small
        >
        New
        <v-divider
          vertical
          class="mr-1 ml-1"
          color="white"
        ></v-divider>
        <v-icon
          right
          class="ma-0"
        >
          mdi-menu-down
        </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="mb-4"/>

    <!-- Row with filtering components -->
    <v-row class="d-flex align-end justify-space-between ml-3 mr-3">
      <v-col cols="2 pa-0 d-flex align-end">
        <v-text-field
          class="mr-4"
          outlined
          dense
          hide-details
          append-icon=""
          v-model="search"
          label="Quick search"
        ></v-text-field>
      </v-col>

      <!--  group of button to toggle between values -->
      <div class="flex-column">
        <p class="text-caption mb-0">Type</p>
        <v-btn-toggle class="mr-4" v-model="toggle_types" dense>
          <v-btn>
            All
          </v-btn>

          <v-btn>
            Tasks
          </v-btn>

          <v-btn>
            Notes
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="flex-column">
        <p class="text-caption mb-0">Priority</p>
        <v-btn-toggle class="mr-4" v-model="toggle_priorities" dense>
          <v-btn>
            All
          </v-btn>

          <v-btn>
            Low
          </v-btn>

          <v-btn>
            Medium
          </v-btn>

          <v-btn>
            High
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- autocompletes for filtering -->
      <div class="flex-column">
        <p class="text-caption mb-0">Reporter</p>
        <v-autocomplete
          class="mr-4"
          outlined
          dense
          hide-details
          chips
          small-chips
          deletable-chips
          multiple
          :items="users"
          item-text="name"
          item-value="id"
          v-model=filter
          append-icon=""
        ></v-autocomplete>
      </div>
      <div class="flex-column">
        <p class="text-caption mb-0">Assignees</p>
        <v-autocomplete
          class="mr-4"
          outlined
          dense
          hide-details
          :items="users"
          item-text="name"
          append-icon=""
        ></v-autocomplete>
      </div>
      <div class="flex-column">
        <p class="text-caption mb-0">Section</p>
        <v-autocomplete
          class="mr-4"
          outlined
          dense
          hide-details
          append-icon=""
        ></v-autocomplete>
      </div>

      <!-- text-field with a datepicker -->
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <div class="flex-column">
            <p class="text-caption mb-0">Date</p>
              <v-text-field
                v-model="date"
                outlined
                dense
                hide-details
                prepend-inner-icon="mdi-calendar-month"
                label=""
                readonly
                v-bind="attrs"
                v-on="on"
              >
            </v-text-field>
          </div>
        </template>
        <v-date-picker
          v-model="date"
          @input="menu = false"
        ></v-date-picker>
      </v-menu>
    </v-row>

      <!-- data-table to show notes data -->
      <v-col
        cols="12"
      >
      <v-data-table
        :headers="tableHeaders"
        :items="tableItems"
        :items-per-page="10"
        show-select
        single-select
        :search="search"
        class=""
        hide-default-footer
      >

      <template v-slot:item.type="{ item }">
        <v-chip
          color="blue-grey"
          label
          small
          dark
        >
          {{ item.type }}
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getProgressColor(item.status)"
          label
          small
          dark
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.priority="{ item }">
        <v-chip
          :color="getPriorityColor(item.priority)"
          label
          small
          dark
        >
          {{ item.priority }}
        </v-chip>
      </template>

      <template v-slot:item.dueDate="{ item }">
        <v-chip
         v-if="passedDueDate(item.dueDate)"
          color="red lighten-4"
          label
          small
          dark
          class="red--text"
        >
          Past due: {{ item.dueDate }}
        </v-chip>
        <p class="text-caption" v-else>{{ item.dueDate }}</p>
      </template>

      <template  v-slot:item.assignees="{ item }">
          <v-avatar  v-for="assignee in item.assignees" :key="assignee.$oid"
            size="25"
          >
            <img
              small
              :src=assignee.photo
              :alt=assignee.name
            >
          </v-avatar>
      </template>
      
      <template v-slot:item.reporter="{ item }">
        <v-avatar  
          size="25"
        >
          <img
            small
            :src=item.reporterId.photo
            :alt=item.reporterId.name
          >
        </v-avatar>
      </template>

      <template v-slot:item.sectionRef="{ item }">
        <v-chip
          v-if="item.sectionRef"
          color="blue-grey"
          label
          small
          dark
        >
          {{ item.sectionRef }}
        </v-chip>
      </template>
      </v-data-table>

      <!-- Load more button -->
      </v-col>
      <v-col
        class="mb-5"
        cols="12"
      >
      <v-btn
        color="light-blue lighten-5"
        light
        block
      >
      Load more
      </v-btn>
      </v-col>
  </v-container>
</template>

<script>
  export default {
    name: 'ReviewNotes',

    data: () => ({
      date: null,
      menu: false,
      modal: false,
      search: "",
      toggle_types: 0,
      toggle_priorities: 0,
      filter: "",
      tableHeaders: [
        { text: "", value: "title", sortable: false,},
        { text: "", value: "type", sortable: false, },
        { text: "", value: "status", sortable: false, },
        { text: "", value: "priority", sortable: false, },
        { text: "", value: "dueDate", sortable: false, },
        { text: "", value: "assignees", sortable: false, },
        { text: "", value: "reporter", sortable: false, },
        { text: "", value: "sectionRef", sortable: false, },
        { text: "", value: "createdAt", sortable: false, },
        { text: "", value: "updatedAt", sortable: false, },
      ],
      notesData: [],
      users: [
          {
            $oid: "001",
            name: "Philip Fry",
          },
          {
            $oid: "002",
            name: "Hermes Conrad"
          },
        ],
      breadcrumbItems: [
        { 
          text: 'Dashboard',
          disabled: false,
          href: 'dashboard'
        },
        { 
          text: 'Microsoft 2021',
          disabled: false,
          href: 'microsoft_2021'
        },
        { 
          text: 'Review notes',
          disabled: true,
          href: 'review_notes'
        },
      ],
    }),
    async mounted() {
      //fetching reviewnotes data from api when mounted
      const response = await fetch('http://localhost:5000');
      this.notesData = await response.json();
    },
    computed: {
      tableItems() {
        //making data look a little better
        let tableItems = this.notesData.map(note => {
          return { ... note,
            priority: note.priority.text,
            dueDate: note.dueDate.toString(),
            createdAt: this.prettifyDate(note.createdAt.$date),
            updatedAt: this.prettifyDate(note.updatedAt.$date),
            type: note.type === 'Reviewnote' ? 'Note' : note.type,
            sectionRef: note.sectionRef ? note.sectionRef.replace(/-/g, ' ') : note.sectionRef
          }
        })
        return tableItems;
      },
    },
    methods: {
      getProgressColor(status) {
        if (status === 'In Progress') return 'blue'
        if (status === "Pending documentation") return 'orange'
        if (status === "Closed") return 'green'
        if (status === "Addressed") return 'purple'
        else return 'blue-grey';
      },
      getPriorityColor(priority) {
        if (priority === 'High') return 'red'
        else if (priority === "Medium") return 'orange'
        else return 'green';
      },
      prettifyDate(noteDate) { 
        let date = new Date(noteDate);
        return date.toISOString().slice(0, 10);
      },
      passedDueDate(dueDate) {
        const date = new Date(dueDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (date < today) {
          return true;
        }
        return false;
      }
    }
  }
</script>

import { Routes } from '@angular/router';
import { CardApiListComponent } from './data/first-page-with-card-api/card-api-list/card-api-list.component';
import { EntityCardListComponent } from './data/pages/entities-page/entity-card-list/entity-card-list.component';

export const routes: Routes = [
    {
        path: '',
        component: CardApiListComponent,
        title: 'Home page',
    },
    {
        path: 'api/ApiService/:name',
        component: EntityCardListComponent ,
        title: 'Api details',
    },
    // {
    //     path: 'entity/edit/:id',
    //     component: EditEntityComponent,
    //     title: 'Edit Entity',
    // },
    // {
    //     path: 'entity/details/:id',
    //     component: EntityDetailsComponent,
    //     title: 'Entity Details',
    // },
    // {
    //     path: 'action/edit/:id',
    //     component: EditActionComponent,
    //     title: 'Edit Action',
    // },
    // {
    //     path: 'action/details/:id',
    //     component: ActionDetailsComponent,
    //     title: 'Action Details',
    // },
    // {
    //     path: 'api/add',
    //     component: AddApiComponent,
    //     title: 'Add API',
    // },
    // {
    //     path: 'entity/add',
    //     component: AddEntityComponent,
    //     title: 'Add Entity',
    // },
    // {
    //     path: 'action/add',
    //     component: AddActionComponent,
    //     title: 'Add Action',
    // },
];

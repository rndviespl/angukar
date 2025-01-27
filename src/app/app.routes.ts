import { Routes } from '@angular/router';
import { CardApiComponent } from './data/first-page-with-card-api/card-api/card-api.component';
import { CardWithEntityComponent } from './data/second-page-with-entity/card-with-entity/card-with-entity.component';

export const routes: Routes = [
    {
        path: '',
        component: CardApiComponent,
        title: 'Home page',
    },
    {
        path: 'api/ApiService/:name',
        component: CardWithEntityComponent,
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

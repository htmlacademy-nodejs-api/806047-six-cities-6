import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { Component } from './shared/types/components.emun.js';
import { RestApplication } from './rest/rest.application.js';
import { createUserContainer } from './shared/modules /user/index.js';
import { createRentContainer } from './shared/modules /rent/index.js';
import { createCommentContainer } from './shared/modules /comment/index.js';
import { createAuthContainer } from './shared/modules /auth/auth.container.js';

async function bootsrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createRentContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootsrap();

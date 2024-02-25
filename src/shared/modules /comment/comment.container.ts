import { Container } from 'inversify';
import { CommentService } from './comment.service.interface.js';
import { Component } from '../../types/components.emun.js';
import { DefaultCommentService } from './default-comment.service.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { Controller } from '../../lib/rest/index.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer() {
  const container = new Container();

  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  return container;
}

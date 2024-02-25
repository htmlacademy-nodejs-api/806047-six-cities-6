export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  RentService: Symbol.for('RentService'),
  RentModel: Symbol.for('RentModel'),
  CommentService: Symbol.for('CommnentService'),
  CommentModel: Symbol.for('CommentModel'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  UserController: Symbol.for('UserController'),
  RentController: Symbol.for('RentController'),
  CommentController: Symbol.for('CommentController'),
} as const;


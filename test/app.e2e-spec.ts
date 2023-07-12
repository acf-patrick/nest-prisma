import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const articleShape = expect.objectContaining({
    id: expect.any(String),
    body: expect.any(String),
    title: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    published: expect.any(Boolean),
  });

  const articlesData = [
    {
      id: '0',
      title: 'title 1',
      description: 'description 1',
      body: 'body 1',
      published: true,
    },
    {
      id: '1',
      title: 'title 2',
      description: 'description 2',
      body: 'body 2',
      published: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    // Enable validation pipe
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.createMany({
      data: articlesData,
    });
  });

  describe('GET /articles', () => {
    it('returns a list published articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/articles',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].published).toBeTruthy();
    });
  });

  describe('POST /artices', () => {
    it('creates an article', async () => {
      const beforeCount = await prisma.article.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/articles')
        .send({
          title: 'title',
          descrption: 'description',
          body: 'body',
          published: false,
        });

      const afterCount = await prisma.article.count();

      expect(status).toBe(201);
      expect(afterCount - beforeCount).toBe(1);
    });

    it('fails to create article without title', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/articles')
        .send({
          description: 'description',
          body: 'body',
          published: true,
        });

      expect(status).toBe(400);
    });
  });
});

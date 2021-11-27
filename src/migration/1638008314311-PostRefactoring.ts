import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1638008314311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createForeignKey
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210316111814 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE participant_activity (participant_id INT NOT NULL, activity_id INT NOT NULL, INDEX IDX_A2358CA79D1C3019 (participant_id), INDEX IDX_A2358CA781C06096 (activity_id), PRIMARY KEY(participant_id, activity_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE participant_activity ADD CONSTRAINT FK_A2358CA79D1C3019 FOREIGN KEY (participant_id) REFERENCES participant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE participant_activity ADD CONSTRAINT FK_A2358CA781C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE activity ADD promoter_id INT NOT NULL, ADD campus_id INT NOT NULL, ADD state_id INT NOT NULL, ADD place_id INT NOT NULL');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095A4B84B276 FOREIGN KEY (promoter_id) REFERENCES participant (id)');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095AAF5D55E1 FOREIGN KEY (campus_id) REFERENCES campus (id)');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095A5D83CC1 FOREIGN KEY (state_id) REFERENCES state (id)');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095ADA6A219 FOREIGN KEY (place_id) REFERENCES place (id)');
        $this->addSql('CREATE INDEX IDX_AC74095A4B84B276 ON activity (promoter_id)');
        $this->addSql('CREATE INDEX IDX_AC74095AAF5D55E1 ON activity (campus_id)');
        $this->addSql('CREATE INDEX IDX_AC74095A5D83CC1 ON activity (state_id)');
        $this->addSql('CREATE INDEX IDX_AC74095ADA6A219 ON activity (place_id)');
        $this->addSql('ALTER TABLE participant ADD campus_id INT NOT NULL');
        $this->addSql('ALTER TABLE participant ADD CONSTRAINT FK_D79F6B11AF5D55E1 FOREIGN KEY (campus_id) REFERENCES campus (id)');
        $this->addSql('CREATE INDEX IDX_D79F6B11AF5D55E1 ON participant (campus_id)');
        $this->addSql('ALTER TABLE place ADD city_id INT NOT NULL');
        $this->addSql('ALTER TABLE place ADD CONSTRAINT FK_741D53CD8BAC62AF FOREIGN KEY (city_id) REFERENCES city (id)');
        $this->addSql('CREATE INDEX IDX_741D53CD8BAC62AF ON place (city_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE participant_activity');
        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095A4B84B276');
        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095AAF5D55E1');
        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095A5D83CC1');
        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095ADA6A219');
        $this->addSql('DROP INDEX IDX_AC74095A4B84B276 ON activity');
        $this->addSql('DROP INDEX IDX_AC74095AAF5D55E1 ON activity');
        $this->addSql('DROP INDEX IDX_AC74095A5D83CC1 ON activity');
        $this->addSql('DROP INDEX IDX_AC74095ADA6A219 ON activity');
        $this->addSql('ALTER TABLE activity DROP promoter_id, DROP campus_id, DROP state_id, DROP place_id');
        $this->addSql('ALTER TABLE participant DROP FOREIGN KEY FK_D79F6B11AF5D55E1');
        $this->addSql('DROP INDEX IDX_D79F6B11AF5D55E1 ON participant');
        $this->addSql('ALTER TABLE participant DROP campus_id');
        $this->addSql('ALTER TABLE place DROP FOREIGN KEY FK_741D53CD8BAC62AF');
        $this->addSql('DROP INDEX IDX_741D53CD8BAC62AF ON place');
        $this->addSql('ALTER TABLE place DROP city_id');
    }
}

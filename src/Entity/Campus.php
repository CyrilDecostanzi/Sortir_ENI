<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CampusRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     collectionOperations={"get", "post"},
 *     itemOperations={"get", "put", "delete", "patch"},
 *     normalizationContext={"groups"={"campus:read"}},
 *     denormalizationContext={"groups"={"campus:write"}},
 * )
 * @ORM\Entity(repositoryClass=CampusRepository::class)
 */
class Campus
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @Groups({"participant:read"})
     * @ORM\Column(type="integer")
     * @Groups({"participant:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"campus:read", "campus:write", "activity:read", "participant:read", "participant:write"})
     * @Assert\NotBlank(
     *      message="Le nom ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=255,
     *     minMessage="Le nom est trop court",
     *     maxMessage = "La limite de caractères autorisés est atteinte"
     * )
     *
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=Participant::class, mappedBy="campus", orphanRemoval=true)
     */
    private $participants;

    /**
     * @ORM\OneToMany(targetEntity=Activity::class, mappedBy="campus", orphanRemoval=true)
     */
    private $activities;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->activities = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|Participant[]
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(Participant $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->participants[] = $participant;
            $participant->setCampus($this);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        if ($this->participants->removeElement($participant)) {
            // set the owning side to null (unless already changed)
            if ($participant->getCampus() === $this) {
                $participant->setCampus(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Activity[]
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    public function addActivity(Activity $activity): self
    {
        if (!$this->activities->contains($activity)) {
            $this->activities[] = $activity;
            $activity->setCampus($this);
        }

        return $this;
    }

    public function removeActivity(Activity $activity): self
    {
        if ($this->activities->removeElement($activity)) {
            // set the owning side to null (unless already changed)
            if ($activity->getCampus() === $this) {
                $activity->setCampus(null);
            }
        }

        return $this;
    }
}

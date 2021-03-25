<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ActivityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     collectionOperations={"get", "post"},
 *     itemOperations={"get"={
 *              "normalization_context"={"groups"={"activity:read", "activity:write"}},
 *          }, "delete", "put", "patch"},
 *     normalizationContext={"groups"={"activity:read"}},
 *     denormalizationContext={"groups"={"activity:write"}},
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "name": "partial",
 *     "state": "exact",
 *     "campus.name": "exact",
 *     "promoter.pseudo": "exact",
 *     "participants.pseudo" : "exact",
 * })
 * @ApiFilter(DateFilter::class, properties={"dateTimeStart"})
 * @ApiFilter(PropertyFilter::class)
 *
 * )
 * @ORM\Entity(repositoryClass=ActivityRepository::class)
 */
class Activity
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *      message="Le nom ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=255,
     *     minMessage="Le nom est trop court",
     *     maxMessage = "La limite de caractères autorisés est atteinte"
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *     message="Choisissez un date de début"
     * )
     */
    private $dateTimeStart;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *     message="Definissez la durée de la sortie"
     * )
     * @Assert\Type(
     *     type="integer",
     *     message="La durée est en minutes"
     * )
     * @Assert\PositiveOrZero(
     *     message="La durée doit être supérieure ou égale à 0"
     * )
     */
    private $duration;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *     message="Definissez une date limite d'inscription"
     * )
     */
    private $registrationDeadline;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *     message="Definissez un nombre maximum de participants"
     * )
     * @Assert\Type(
     *     type="integer",
     *     message="Le nombre de participants maximum doit être un entier ;-)"
     * )
     * @Assert\Positive(
     *     message="Le nombre d'inscriptions maximum doit être supérieure à 0"
     * )
     */
    private $registrationsMax;

    /**
     * @ORM\Column(type="text")
     * @Groups({"activity:read", "activity:write", "campus:read", "state:read"})
     * @Assert\NotBlank(
     *     message="La description ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=255,
     *     minMessage="La description est trop courte",
     *     maxMessage = "La limite de caractères autorisés est atteinte"
     * )
     */
    private $description;

    /**
     * @ORM\ManyToMany(targetEntity=Participant::class, mappedBy="activities")
     * @Groups({"activity:read", "activity:write", "campus:read"})
     * @Assert\Valid()
     */
    private $participants;

    /**
     * @ORM\ManyToOne(targetEntity=Participant::class, inversedBy="promotedActivities")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"activity:read", "activity:write", "campus:read"})
     * @Assert\Valid()
     */
    private $promoter;

    /**
     * @ORM\ManyToOne(targetEntity=Campus::class, inversedBy="activities")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"activity:read", "activity:write"})
     * @Assert\Valid()
     */
    private $campus;

    /**
     * @ORM\ManyToOne(targetEntity=State::class, inversedBy="activities")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"activity:read", "activity:write", "campus:read"})
     * @Assert\Valid()
     */
    private $state;

    /**
     * @ORM\ManyToOne(targetEntity=Place::class, inversedBy="activities", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"activity:read", "activity:write"})
     */
    private $place;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
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

    public function getDateTimeStart(): ?\DateTimeInterface
    {
        return $this->dateTimeStart;
    }

    public function setDateTimeStart(\DateTimeInterface $dateTimeStart): self
    {
        $this->dateTimeStart = $dateTimeStart;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getRegistrationDeadline(): ?\DateTimeInterface
    {
        return $this->registrationDeadline;
    }

    public function setRegistrationDeadline(\DateTimeInterface $registrationDeadline): self
    {
        $this->registrationDeadline = $registrationDeadline;

        return $this;
    }

    public function getRegistrationsMax(): ?int
    {
        return $this->registrationsMax;
    }

    public function setRegistrationsMax(int $registrationsMax): self
    {
        $this->registrationsMax = $registrationsMax;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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
            $participant->addActivity($this);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        if ($this->participants->removeElement($participant)) {
            $participant->removeActivity($this);
        }

        return $this;
    }

    public function getPromoter(): ?Participant
    {
        return $this->promoter;
    }

    public function setPromoter(?Participant $promoter): self
    {
        $this->promoter = $promoter;

        return $this;
    }

    public function getCampus(): ?Campus
    {
        return $this->campus;
    }

    public function setCampus(?Campus $campus): self
    {
        $this->campus = $campus;

        return $this;
    }

    public function getState(): ?State
    {
        return $this->state;
    }

    public function setState(?State $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getPlace(): ?Place
    {
        return $this->place;
    }

    public function setPlace(?Place $place): self
    {
        $this->place = $place;

        return $this;
    }
}

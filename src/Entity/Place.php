<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\PlaceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     collectionOperations={"get"},
 *     itemOperations={"get", "put", "delete", "patch"},
 *     normalizationContext={"groups"={"place:read"}},
 *     denormalizationContext={"groups"={"place:write"}},
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "city.id": "exact",
 * })
 * @ORM\Entity(repositoryClass=PlaceRepository::class)
 */
class Place
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message="Le nom ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=255,
     *     minMessage="Le nom est trop court",
     *     maxMessage = "La limite de caractères autorisés est atteinte"
     * )
     * @Groups({"activity:read", "place:read", "activity:write", "city:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message="Le nom ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=255,
     *     minMessage="Le nom de la rue est trop court",
     *     maxMessage = "La limite de caractères autorisés est atteinte"
     * )
     * @Groups({"activity:read", "activity:write", "city:read", "place:read"})
     */
    private $street;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(
     *     message="Veuillez renseigner la latitude"
     * )
     * @Assert\Type(
     *     type="float",
     *     message="Le type de la latitude doit être un nombre décimal"
     * )
     * @Groups({"activity:read", "activity:write", "city:read", "place:read", "place:write"})
     */
    private $latitude;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(
     *      message="Veuillez renseigner la latitude"
     * )
     * @Assert\Type(
     *     type="float",
     *     message="Le type de la longitude doit être un nombre décimal"
     * )
     * @Groups({"activity:read", "activity:write", "city:read", "place:read", "place:write"})
     */
    private $longitude;

    /**
     * @ORM\OneToMany(targetEntity=Activity::class, mappedBy="place", orphanRemoval=true)
     * @Assert\Valid
     */
    private $activities;

    /**
     * @ORM\ManyToOne(targetEntity=City::class, inversedBy="places", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Valid
     * @Groups({"activity:read", "activity:write", "city:read", "city:write", "place:read", "place:write"})
     */
    private $city;

    public function __construct()
    {
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

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;

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
            $activity->setPlace($this);
        }

        return $this;
    }

    public function removeActivity(Activity $activity): self
    {
        if ($this->activities->removeElement($activity)) {
            // set the owning side to null (unless already changed)
            if ($activity->getPlace() === $this) {
                $activity->setPlace(null);
            }
        }

        return $this;
    }

    public function getCity(): ?City
    {
        return $this->city;
    }

    public function setCity(?City $city): self
    {
        $this->city = $city;

        return $this;
    }
}

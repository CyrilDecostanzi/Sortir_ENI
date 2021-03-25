<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=CityRepository::class)
 * @ApiResource(
 *     collectionOperations={"get", "post"},
 *     itemOperations={"get", "put", "delete", "patch"},
 *     normalizationContext={"groups"={"city:read"}},
 *     denormalizationContext={"groups"={"city:write"}},
 * )
 */
class City
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
     * @Groups({"city:read", "city:write", "activity:read", "activity:write"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=5)
     * @Assert\NotBlank(
     *      message="Le code postal ne peut être vide"
     * )
     * @Assert\Length (
     *     min=2,
     *     max=5,
     *     minMessage="Le code postal est trop court",
     *     maxMessage = "Le code postal ne peut dépasser 5 caractères"
     * )
     * @Groups({"city:read", "city:write", "activity:read", "activity:write"})
     */
    private $postalCode;

    /**
     * @ORM\OneToMany(targetEntity=Place::class, mappedBy="city", orphanRemoval=true)
     * @Assert\Valid
     */
    private $places;

    public function __construct()
    {
        $this->places = new ArrayCollection();
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

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setPostalCode(string $postalCode): self
    {
        $this->postalCode = $postalCode;

        return $this;
    }

    /**
     * @return Collection|Place[]
     */
    public function getPlaces(): Collection
    {
        return $this->places;
    }

    public function addPlace(Place $place): self
    {
        if (!$this->places->contains($place)) {
            $this->places[] = $place;
            $place->setCity($this);
        }

        return $this;
    }

    public function removePlace(Place $place): self
    {
        if ($this->places->removeElement($place)) {
            // set the owning side to null (unless already changed)
            if ($place->getCity() === $this) {
                $place->setCity(null);
            }
        }

        return $this;
    }
}

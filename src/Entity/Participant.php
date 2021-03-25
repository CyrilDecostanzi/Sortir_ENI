<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ParticipantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ApiResource(
 *     collectionOperations={
 *          "get",
 *          "post"
 *     },
 *     itemOperations={
 *          "get",
 *          "put",
 *          "patch",
 *          "delete"
 *     },
 *     normalizationContext={"groups"={"participant:read"}},
 *     denormalizationContext={"groups"={"participant:write"}},
 * )
 * @ORM\Entity(repositoryClass=ParticipantRepository::class)
 * @UniqueEntity(
 *     fields={"pseudo"},
 *     message="Le pseudo est déja utilisé"
 * )
 * @UniqueEntity(
 *     fields={"mail"},
 *     message="Le mail est déja utilisé"
 * )
 */
class Participant implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"participant:read", "activity:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"participant:read", "participant:write", "activity:read"})
     * @Assert\NotBlank(
     *     message="Le pseudo ne peut être vide"
     * )
     * @Assert\Length(
     *     max=50,
     *     maxMessage="Le pseudo ne doit pas depasser 50 caractères"
     * )
     */
    private $pseudo;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"participant:read", "participant:write", "activity:read"})
     * @Assert\NotBlank(
     *     message="Le nom ne peut être vide"
     * )
     * @Assert\Length(
     *     max=50,
     *     maxMessage="Le nom ne doit pas depasser 50 caractères"
     * )
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"participant:read", "participant:write", "activity:read"})
     * @Assert\NotBlank(
     *     message="Le prenom ne peut être vide"
     * )
     * @Assert\Length(
     *     max=50,
     *     maxMessage="Le prenom ne doit pas depasser 50 caractères"
     * )
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=14, nullable=true)
     * @Groups({"participant:read", "participant:write"})
     * @Assert\Type(
     *     type="digit",
     *     message="Le numero de telephone ne doit contenir que des chiffres"
     * )
     */
    private $phoneNumber;

    /**
     * @ORM\Column(type="string", length=150)
     * @Groups({"participant:read", "participant:write"})
     * @Assert\NotBlank(
     *     message="L'email ne peut être vide"
     * )
     * @Assert\Email(
     *     message = "L'email n'a pas un format valide"
     * )
     */
    private $mail;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *     message="Le mot de passe ne peut être vide"
     * )
     * @Assert\Length(
     *     max=255,
     *     maxMessage="Le mot de passe est trop long"
     * )
     */
    private $password;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"participant:read", "participant:write"})
     */
    private $isAdmin;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"participant:read", "participant:write"})
     */
    private $isActive;

    /**
     * @ORM\ManyToMany(targetEntity=Activity::class, inversedBy="participants")
     * @Groups({"participant:read", "participant:write"})
     * @Assert\Valid()
     */
    private $activities;

    /**
     * @ORM\ManyToOne(targetEntity=Campus::class, inversedBy="participants")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"participant:read", "participant:write", "campus:read"})
     */
    private $campus;

    /**
     * @ORM\OneToMany(targetEntity=Activity::class, mappedBy="promoter", orphanRemoval=true)
     * @Groups({"participant:read", "participant:write"})
     * @Assert\Valid()
     */
    private $promotedActivities;

    /**
     * @Groups("participant:write")
     * @SerializedName("password")
     */
    private $plainPassword;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
        $this->promotedActivities = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(string $mail): self
    {
        $this->mail = $mail;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getIsAdmin(): ?bool
    {
        return $this->isAdmin;
    }

    public function setIsAdmin(bool $isAdmin): self
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * @return Collection|Activity[]
     */
    public function getActivity(): Collection
    {
        return $this->activities;
    }

    public function addActivity(Activity $activity): self
    {
        if (!$this->activities->contains($activity)) {
            $this->activities[] = $activity;
        }

        return $this;
    }

    public function removeActivity(Activity $activity): self
    {
        $this->activities->removeElement($activity);

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

    /**
     * @return Collection|Activity[]
     */
    public function getPromotedActivities(): Collection
    {
        return $this->promotedActivities;
    }

    public function addPromotedActivity(Activity $promotedActivity): self
    {
        if (!$this->promotedActivities->contains($promotedActivity)) {
            $this->promotedActivities[] = $promotedActivity;
            $promotedActivity->setPromoter($this);
        }

        return $this;
    }

    public function removePromotedActivity(Activity $promotedActivity): self
    {
        if ($this->promotedActivities->removeElement($promotedActivity)) {
            // set the owning side to null (unless already changed)
            if ($promotedActivity->getPromoter() === $this) {
                $promotedActivity->setPromoter(null);
            }
        }

        return $this;
    }

    public function getRoles()
    {
        if ($this->getIsAdmin() === 1) {
            $roles[] = 'ROLE_ADMIN';
        } else {
            $roles[] = 'ROLE_USER';
        }

        return array_unique($roles);
    }

    public function getSalt() { }

    public function getUsername()
    {
        return (string)$this->pseudo;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
    public function setPlainPassword(string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }
}

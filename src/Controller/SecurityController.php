<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="app_login", methods={"POST"})
     */
    public function login()
    {
    }

    /**
     * @Route("/getuser", name="app_get_user", methods={"GET"})
     */
    public function getAppUser()
    {
        $user = $this->getUser();
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'participant:read']);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
    }

}
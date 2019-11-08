<?php
/**
 * Created by IntelliJ IDEA.
 * User: johan
 * Date: 07/11/2019
 * Time: 11:23
 */

namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(ViewEvent $event)
    {
        $result = $event->getControllerResult();//is a user
        $method = $event->getRequest()->getMethod();//POST GET PUT


        if($result instanceof User && $method == "POST") {
            $hash = $this->encoder->encodePassword($result, $result->getPassword());
            $result->setPassword($hash);
        }
    }
}
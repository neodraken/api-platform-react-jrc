<?php
/**
 * Created by IntelliJ IDEA.
 * User: johan
 * Date: 07/11/2019
 * Time: 12:12
 */

namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();//POST GET PUT

        if ($customer instanceof Customer && $method === "POST") {
            //current connected user
            $user = $this->security->getUser();
            //add to customer
            $customer->setUser($user);
        }
    }
}
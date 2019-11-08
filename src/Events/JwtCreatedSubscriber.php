<?php
/**
 * Created by IntelliJ IDEA.
 * User: johan
 * Date: 07/11/2019
 * Time: 16:37
 */

namespace App\Events;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        //1.recuperer l'uitlisateur (pour avoir son firstName et lastName)
        $user=$event->getUser();

        //2.Enrichir les data pour qu'elles contiennent ces données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }

}